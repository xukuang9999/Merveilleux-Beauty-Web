import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  trainingModules,
  quizQuestions,
  trainingProgress,
  type TrainingModule,
  type QuizQuestion,
} from "@/db/schema";

export type ModuleWithQuiz = TrainingModule & { quiz: QuizQuestion[] };

export async function getModules(): Promise<TrainingModule[]> {
  return db.select().from(trainingModules).orderBy(asc(trainingModules.ord));
}

export async function getModulesWithQuiz(): Promise<ModuleWithQuiz[]> {
  const mods = await getModules();
  const out: ModuleWithQuiz[] = [];
  for (const m of mods) {
    const quiz = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.moduleId, m.id));
    out.push({ ...m, quiz });
  }
  return out;
}

export type ProgressRow = typeof trainingProgress.$inferSelect;

export async function getUserProgress(userId: string): Promise<ProgressRow[]> {
  return db
    .select()
    .from(trainingProgress)
    .where(eq(trainingProgress.userId, userId));
}
