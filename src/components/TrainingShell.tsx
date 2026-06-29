"use client";

import { useMemo, useState } from "react";
import { trainingModules, PASS_MARK } from "@/lib/data";

// Sample quiz used by the demo. In the real LMS each module has its own
// 20-question bank served from the backend; this is a representative preview.
type Question = {
  q: string;
  options: string[];
  answer: number;
};

const demoQuestions: Question[] = [
  {
    q: "What does “Merveilleux” mean?",
    options: ["Mysterious", "Marvellous", "Modern", "Mineral"],
    answer: 1,
  },
  {
    q: "What standard are our formulas developed to?",
    options: [
      "No particular standard",
      "French cosmetic standards (OEM)",
      "DIY home-made",
      "Food-grade only",
    ],
    answer: 1,
  },
  {
    q: "What is the correct routine order?",
    options: [
      "Cream → Serum → Cleanser",
      "Serum → Cleanser → Essence",
      "Cleanse → Essence → Serum → Cream",
      "Essence → Cream → Cleanse",
    ],
    answer: 2,
  },
  {
    q: "What must a new 经销商 complete before selling?",
    options: [
      "Nothing, start immediately",
      "Only read one PDF",
      "Online training + in-person onboarding",
      "A payment only",
    ],
    answer: 2,
  },
  {
    q: "The passing mark for each module quiz is…",
    options: ["50", "70", "90", "100"],
    answer: 1,
  },
];

export default function TrainingShell() {
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null);

  const progress = Math.round((completed.size / trainingModules.length) * 100);
  const allDone = completed.size === trainingModules.length;

  function markComplete(id: number) {
    setCompleted((prev) => new Set(prev).add(id));
    setActiveQuiz(null);
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-10 rounded-2xl border border-line bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-mid">
              Your progress
            </p>
            <p className="mt-1 font-serif text-2xl text-charcoal">
              {completed.size} of {trainingModules.length} modules complete
            </p>
          </div>
          <span className="font-serif text-3xl text-rose-deep">{progress}%</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-rose-light/50">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-deep to-gold transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {allDone && (
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-green/30 bg-green-light/60 px-4 py-3">
            <span className="text-xl">🎉</span>
            <p className="text-sm text-charcoal">
              All modules complete! In the live portal, your in-person training
              booking link unlocks here automatically.
            </p>
          </div>
        )}
      </div>

      {/* Module grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {trainingModules.map((m) => {
          const done = completed.has(m.id);
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
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-light px-3 py-1 text-[11px] font-semibold text-green">
                    ✓ Completed
                  </span>
                ) : (
                  <span className="rounded-full bg-gold-light px-3 py-1 text-[11px] font-semibold text-amber">
                    Module {m.id}
                  </span>
                )}
              </div>
              <h3 className="mt-4 font-serif text-2xl text-charcoal">
                {m.title}
              </h3>
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
                  ~{m.durationMins} min · {m.quizQuestions}Q quiz
                </span>
                <button
                  onClick={() => setActiveQuiz(m.id)}
                  className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                    done
                      ? "border border-line text-mid hover:text-charcoal"
                      : "bg-charcoal text-cream hover:bg-plum"
                  }`}
                >
                  {done ? "Review quiz" : "Start quiz"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {activeQuiz !== null && (
        <QuizModal
          moduleId={activeQuiz}
          onClose={() => setActiveQuiz(null)}
          onPass={() => markComplete(activeQuiz)}
        />
      )}
    </div>
  );
}

function QuizModal({
  moduleId,
  onClose,
  onPass,
}: {
  moduleId: number;
  onClose: () => void;
  onPass: () => void;
}) {
  const questions = demoQuestions;
  const moduleName =
    trainingModules.find((m) => m.id === moduleId)?.title ?? "Module";
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    const correct = questions.reduce(
      (acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0),
      0,
    );
    return Math.round((correct / questions.length) * 100);
  }, [answers, questions]);

  const passed = score >= PASS_MARK;
  const allAnswered = Object.keys(answers).length === questions.length;

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
            <p className="eyebrow">Module {moduleId} · Demo Quiz</p>
            <h3 className="mt-1 font-serif text-2xl text-charcoal">
              {moduleName}
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

        {!submitted ? (
          <>
            <div className="mt-6 space-y-6">
              {questions.map((q, qi) => (
                <fieldset key={qi}>
                  <legend className="text-sm font-medium text-charcoal">
                    {qi + 1}. {q.q}
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
              disabled={!allAnswered}
              onClick={() => setSubmitted(true)}
              className="mt-7 w-full rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-plum disabled:cursor-not-allowed disabled:opacity-40"
            >
              Submit quiz ({Object.keys(answers).length}/{questions.length})
            </button>
          </>
        ) : (
          <div className="mt-6 text-center">
            <div
              className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-3xl ${
                passed ? "bg-green-light text-green" : "bg-rose-light text-rose-deep"
              }`}
            >
              {passed ? "✓" : "↺"}
            </div>
            <h4 className="mt-4 font-serif text-3xl text-charcoal">
              {score}%
            </h4>
            <p className="mt-1 text-sm text-mid">
              {passed
                ? `You passed! (${PASS_MARK} needed to pass)`
                : `${PASS_MARK} needed to pass — give it another try.`}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              {passed ? (
                <button
                  onClick={onPass}
                  className="rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-cream hover:bg-plum"
                >
                  Mark module complete
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSubmitted(false);
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
