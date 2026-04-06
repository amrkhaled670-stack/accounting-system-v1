import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/lib/language-context";
import { Navbar } from "@/components/navbar";
import { Toaster } from "sonner";
import { type Locale } from "@/lib/i18n";
import { verifySession } from "@/lib/session";
import { CommandPalette } from "@/components/command-palette";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "نظام المحاسبة",
  description: "نظام محاسبة متكامل لإدارة الأصناف والمخازن والموردين",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "ar";
  const session = await verifySession();
  const isLoggedIn = !!session;

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${cairo.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <LanguageProvider initialLocale={locale}>
            {isLoggedIn && <Navbar />}
            {isLoggedIn ? (
              <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
                {children}
              </main>
            ) : (
              <main className="flex-1">{children}</main>
            )}
            {isLoggedIn && (
              <footer className="border-t border-card-border py-4 text-center text-xs text-muted">
                {locale === "ar" ? "نظام المحاسبة" : "Accounting System"} © {new Date().getFullYear()}
              </footer>
            )}
            {isLoggedIn && <CommandPalette />}
            <Toaster
              position={locale === "ar" ? "bottom-left" : "bottom-right"}
              richColors
              dir={locale === "ar" ? "rtl" : "ltr"}
            />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
