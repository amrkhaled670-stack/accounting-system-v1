import { cookies } from "next/headers";
import { type Locale, t } from "@/lib/i18n";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "ar";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-indigo-600 text-white text-2xl font-bold mb-4 shadow-lg">
            {t(locale, "nav.logo")}
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {t(locale, "auth.login")}
          </h1>
          <p className="text-muted text-sm mt-1">
            {t(locale, "auth.welcome")}
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
