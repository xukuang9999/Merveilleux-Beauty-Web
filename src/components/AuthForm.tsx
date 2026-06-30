"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, registerAction, type AuthState } from "@/lib/auth-actions";
import type { Dictionary } from "@/i18n/dictionaries/en";

const field =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-charcoal outline-none transition-colors placeholder:text-mid/60 focus:border-rose-deep";
const label =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-mid";

export default function AuthForm({
  mode,
  defaultRole = "customer",
  dict,
}: {
  mode: "login" | "register";
  defaultRole?: "customer" | "distributor";
  dict: Dictionary["auth"];
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
              {dict.fullName}
            </label>
            <input id="name" name="name" required placeholder={dict.yourName} className={field} />
          </div>
        </>
      )}

      <div>
        <label htmlFor="email" className={label}>
          {dict.email}
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
          {dict.password}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          placeholder={isRegister ? dict.pwHintRegister : dict.pwHintLogin}
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
          ? isRegister
            ? dict.creating
            : dict.signingIn
          : isRegister
            ? dict.createAccount
            : dict.signIn}
      </button>

      <p className="pt-1 text-center text-sm text-mid">
        {isRegister ? (
          <>
            {dict.haveAccount}{" "}
            <Link href="/login" className="font-medium text-rose-deep underline">
              {dict.signIn}
            </Link>
          </>
        ) : (
          <>
            {dict.newHere}{" "}
            <Link href="/register" className="font-medium text-rose-deep underline">
              {dict.createOne}
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
