"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, registerAction, type AuthState } from "@/lib/auth-actions";

const field =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-charcoal outline-none transition-colors placeholder:text-mid/60 focus:border-rose-deep";
const label =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-mid";

export default function AuthForm({
  mode,
  defaultRole = "customer",
}: {
  mode: "login" | "register";
  defaultRole?: "customer" | "distributor";
}) {
  const action = mode === "login" ? loginAction : registerAction;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    action,
    undefined,
  );
  const isRegister = mode === "register";

  return (
    <form action={formAction} className="space-y-4">
      {isRegister && (
        <>
          <input type="hidden" name="role" defaultValue={defaultRole} />
          <div>
            <label htmlFor="name" className={label}>
              Full name
            </label>
            <input id="name" name="name" required placeholder="Your name" className={field} />
          </div>
        </>
      )}

      <div>
        <label htmlFor="email" className={label}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@email.com"
          className={field}
        />
      </div>

      <div>
        <label htmlFor="password" className={label}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          placeholder={isRegister ? "At least 8 characters" : "Your password"}
          className={field}
        />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-rose-light/60 px-3 py-2 text-sm text-rose-deep">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-plum disabled:opacity-50"
      >
        {pending
          ? "Please wait…"
          : isRegister
            ? "Create account"
            : "Sign in"}
      </button>

      <p className="pt-1 text-center text-sm text-mid">
        {isRegister ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-rose-deep underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link
              href="/register"
              className="font-medium text-rose-deep underline"
            >
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
