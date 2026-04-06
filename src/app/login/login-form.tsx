"use client";

import { useActionState } from "react";
import { login } from "./actions";
import { useLanguage } from "@/lib/language-context";

export function LoginForm() {
  const { t } = useLanguage();
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="stat-card space-y-5">
      {state?.error && (
        <div className="bg-danger/10 text-danger text-sm px-4 py-3 rounded-lg border border-danger/20">
          {t(state.error)}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
          {t("auth.email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          autoFocus
          className="input-field"
          placeholder="admin@system.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
          {t("auth.password")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="input-field"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full py-3 disabled:opacity-50"
      >
        {pending ? t("auth.loggingIn") : t("auth.loginBtn")}
      </button>
    </form>
  );
}
