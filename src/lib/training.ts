import { asc, eq } from "drizzle-orm";
import { db, hasRemoteDb, withDbDeadline } from "@/db";
import {
  trainingModules,
  quizQuestions,
  trainingProgress,
  type TrainingModule,
  type QuizQuestion,
} from "@/db/schema";
import { getLocale } from "@/i18n/server";
import { contentPack } from "@/i18n/content";
import { localizeQuiz } from "@/i18n/content/quiz";

export type ModuleWithQuiz = TrainingModule & { quiz: QuizQuestion[] };

export async function getModules(): Promise<TrainingModule[]> {
  if (!hasRemoteDb) return [];
  const rows = await withDbDeadline(db
    .select()
    .from(trainingModules)
    .orderBy(asc(trainingModules.ord), asc(trainingModules.id)));
  const pack = contentPack(await getLocale());
  if (!pack) return rows;
  return rows.map((m) => {
    const t = pack.modules[m.ord];
    return t
      ? { ...m, title: t.title, summary: t.summary, lessons: t.lessons }
      : m;
  });
}

export async function getModulesWithQuiz(): Promise<ModuleWithQuiz[]> {
  const mods = await getModules();
  const locale = await getLocale();
  const out: ModuleWithQuiz[] = [];
  for (const m of mods) {
    const quiz = await withDbDeadline(db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.moduleId, m.id))
      .orderBy(asc(quizQuestions.id)));
    out.push({ ...m, quiz: localizeQuiz(m.ord, quiz, locale) });
  }
  return out;
}

export type ProgressRow = typeof trainingProgress.$inferSelect;

export async function getUserProgress(userId: string): Promise<ProgressRow[]> {
  if (!hasRemoteDb) return [];
  return withDbDeadline(db
    .select()
    .from(trainingProgress)
    .where(eq(trainingProgress.userId, userId)));
}
