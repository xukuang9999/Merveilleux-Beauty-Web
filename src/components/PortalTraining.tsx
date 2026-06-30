"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { submitQuiz } from "@/lib/training-actions";

type Question = { id: number; question: string; options: string[] };
type Module = {
  id: number;
  ord: number;
  icon: string;
  title: string;
  cnTitle: string;
  summary: string;
  lessons: string[];
  durationMins: number;
  quiz: Question[];
};
type Progress = { moduleId: number; completed: boolean; score: number };

const PASS_MARK = 70;

export default function PortalTraining({
  modules,
  progress,
}: {
  modules: Module[];
  progress: Progress[];
}) {
  const [active, setActive] = useState<Module | null>(null);
  const progressMap = useMemo(() => {
    const m = new Map<number, Progress>();
    progress.forEach((p) => m.set(p.moduleId, p));
    return m;
  }, [progress]);

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {modules.map((m) => {
        const p = progressMap.get(m.id);
        const done = p?.completed;
        return (
          <div
            key={m.id}
            className={`rounded-2xl border bg-white p-6 transition-colors ${
              done ? "border-green/40" : "border-line"
            }`}
          >
            <div className="flex items-start justify-between">
              <span className="text-3xl">{m.icon}</span>
              {done ? (
                <span className="rounded-full bg-green-light px-3 py-1 text-[11px] font-semibold text-green">
                  ✓ Completed · {p?.score}%
                </span>
              ) : p ? (
                <span className="rounded-full bg-amber-light px-3 py-1 text-[11px] font-semibold text-amber">
                  Best {p.score}%
                </span>
              ) : (
                <span className="rounded-full bg-gold-light px-3 py-1 text-[11px] font-semibold text-amber">
                  Module {m.ord}
                </span>
              )}
            </div>
            <h3 className="mt-4 font-serif text-2xl text-charcoal">{m.title}</h3>
            <p className="text-sm text-mid">{m.cnTitle}</p>
            <p className="mt-3 text-sm leading-relaxed text-mid">{m.summary}</p>
            <ul className="mt-4 space-y-1.5">
              {m.lessons.map((l) => (
                <li
                  key={l}
                  className="flex items-start gap-2 text-[13px] text-charcoal"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-rose-deep" />
                  {l}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
              <span className="text-xs text-mid">
                ~{m.durationMins} min · {m.quiz.length}-question quiz
              </span>
              <button
                onClick={() => setActive(m)}
                className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                  done
                    ? "border border-line text-mid hover:text-charcoal"
                    : "bg-charcoal text-cream hover:bg-plum"
                }`}
              >
                {done ? "Retake quiz" : "Start quiz"}
              </button>
            </div>
          </div>
        );
      })}

      {active && (
        <QuizModal module={active} onClose={() => setActive(null)} />
      )}
    </div>
  );
}

function QuizModal({
  module,
  onClose,
}: {
  module: Module;
  onClose: () => void;
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);

  const allAnswered = Object.keys(answers).length === module.quiz.length;

  async function handleSubmit() {
    setSubmitting(true);
    const ordered = module.quiz.map((_, i) => answers[i] ?? -1);
    try {
      const r = await submitQuiz(module.id, ordered);
      setResult(r);
      if (r.passed) router.refresh();
    } catch {
      setResult({ score: 0, passed: false });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-cream p-7 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="eyebrow">Module {module.ord} · Quiz</p>
            <h3 className="mt-1 font-serif text-2xl text-charcoal">
              {module.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-mid hover:text-charcoal"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {!result ? (
          <>
            <div className="mt-6 space-y-6">
              {module.quiz.map((q, qi) => (
                <fieldset key={q.id}>
                  <legend className="text-sm font-medium text-charcoal">
                    {qi + 1}. {q.question}
                  </legend>
                  <div className="mt-3 space-y-2">
                    {q.options.map((opt, oi) => (
                      <label
                        key={oi}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition-colors ${
                          answers[qi] === oi
                            ? "border-rose-deep bg-rose-light/40 text-charcoal"
                            : "border-line bg-white text-mid hover:border-rose-light"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${qi}`}
                          checked={answers[qi] === oi}
                          onChange={() =>
                            setAnswers((a) => ({ ...a, [qi]: oi }))
                          }
                          className="accent-rose-deep"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
            <button
              disabled={!allAnswered || submitting}
              onClick={handleSubmit}
              className="mt-7 w-full rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-plum disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting
                ? "Marking…"
                : `Submit quiz (${Object.keys(answers).length}/${module.quiz.length})`}
            </button>
          </>
        ) : (
          <div className="mt-6 text-center">
            <div
              className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-3xl ${
                result.passed
                  ? "bg-green-light text-green"
                  : "bg-rose-light text-rose-deep"
              }`}
            >
              {result.passed ? "✓" : "↺"}
            </div>
            <h4 className="mt-4 font-serif text-3xl text-charcoal">
              {result.score}%
            </h4>
            <p className="mt-1 text-sm text-mid">
              {result.passed
                ? `You passed! (${PASS_MARK} needed) — progress saved.`
                : `${PASS_MARK} needed to pass — give it another try.`}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              {result.passed ? (
                <button
                  onClick={onClose}
                  className="rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-cream hover:bg-plum"
                >
                  Done
                </button>
              ) : (
                <button
                  onClick={() => {
                    setResult(null);
                    setAnswers({});
                  }}
                  className="rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-cream hover:bg-plum"
                >
                  Retake quiz
                </button>
              )}
              <button
                onClick={onClose}
                className="rounded-full border border-line px-6 py-3 text-sm font-medium text-charcoal hover:border-rose-deep"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
