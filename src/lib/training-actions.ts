"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireRole } from "./auth";
import { db } from "@/db";
import { quizQuestions, trainingProgress } from "@/db/schema";
import { PASS_MARK } from "./seed-data";

export async function submitQuiz(
  moduleId: number,
  answers: number[],
): Promise<{ score: number; passed: boolean }> {
  // Gate the write-path to the same roles as the training pages/chat.
  const user = await requireRole(["distributor", "admin", "master_admin"]);

  const qs = await db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.moduleId, moduleId));
  if (!qs.length) return { score: 0, passed: false };

  let correct = 0;
  qs.forEach((q, i) => {
    if (answers[i] === q.answerIndex) correct++;
  });
  const score = Math.round((correct / qs.length) * 100);
  const passed = score >= PASS_MARK;

  // Atomic upsert — keep the best score, never regress completed status.
  await db
    .insert(trainingProgress)
    .values({
      userId: user.id,
      moduleId,
      score,
      completed: passed,
      completedAt: passed ? new Date() : null,
    })
    .onConflictDoUpdate({
      target: [trainingProgress.userId, trainingProgress.moduleId],
      set: {
        score: sql`greatest(${trainingProgress.score}, excluded.score)`,
        completed: sql`${trainingProgress.completed} OR excluded.completed`,
        completedAt: sql`coalesce(${trainingProgress.completedAt}, excluded.completed_at)`,
      },
    });

  revalidatePath("/portal/training");
  revalidatePath("/portal");
  return { score, passed };
}
