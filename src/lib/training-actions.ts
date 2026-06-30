"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireUser } from "./auth";
import { db } from "@/db";
import { quizQuestions, trainingProgress } from "@/db/schema";
import { PASS_MARK } from "./seed-data";

export async function submitQuiz(
  moduleId: number,
  answers: number[],
): Promise<{ score: number; passed: boolean }> {
  const user = await requireUser();

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

  const [existing] = await db
    .select()
    .from(trainingProgress)
    .where(
      and(
        eq(trainingProgress.userId, user.id),
        eq(trainingProgress.moduleId, moduleId),
      ),
    )
    .limit(1);

  if (existing) {
    await db
      .update(trainingProgress)
      .set({
        score: Math.max(existing.score, score),
        completed: existing.completed || passed,
        completedAt:
          existing.completedAt ?? (passed ? new Date() : null),
      })
      .where(eq(trainingProgress.id, existing.id));
  } else {
    await db.insert(trainingProgress).values({
      userId: user.id,
      moduleId,
      score,
      completed: passed,
      completedAt: passed ? new Date() : null,
    });
  }

  revalidatePath("/portal/training");
  revalidatePath("/portal");
  return { score, passed };
}
