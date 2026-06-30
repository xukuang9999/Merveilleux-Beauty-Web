import { requireRole } from "@/lib/auth";
import { getModulesWithQuiz, getUserProgress } from "@/lib/training";
import { DashHeading } from "@/components/dash";
import PortalTraining from "@/components/PortalTraining";
import { getDict, fmt } from "@/i18n/server";

export default async function PortalTrainingPage() {
  const user = await requireRole(["distributor", "admin"]);
  const [modules, progress, dict] = await Promise.all([
    getModulesWithQuiz(),
    getUserProgress(user.id),
    getDict(),
  ]);
  const d = dict.portalTraining;

  // Never send the correct answers to the client — scoring is server-side.
  const clientModules = modules.map((m) => ({
    id: m.id,
    ord: m.ord,
    icon: m.icon,
    title: m.title,
    cnTitle: m.cnTitle,
    summary: m.summary,
    lessons: m.lessons,
    durationMins: m.durationMins,
    quiz: m.quiz.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
    })),
  }));
  const clientProgress = progress.map((p) => ({
    moduleId: p.moduleId,
    completed: p.completed,
    score: p.score,
  }));

  const completed = clientProgress.filter((p) => p.completed).length;

  return (
    <>
      <DashHeading
        eyebrow={d.eyebrow}
        title={d.title}
        subtitle={fmt(d.sub, { done: completed, total: modules.length })}
      />
      <PortalTraining
        modules={clientModules}
        progress={clientProgress}
        dict={d}
      />
    </>
  );
}
