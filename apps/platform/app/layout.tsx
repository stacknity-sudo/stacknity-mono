import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@stacknity/shared-theme/client";
import ThemeToggleButton from "@/components/theme-toggle/theme-toggle-button";
import { AuthProvider } from "../hooks/auth/auth-context";
import { AuthNavigationHandler } from "../hooks/auth/AuthNavigationHandler";

export const metadata: Metadata = {
  title: "Stacknity Platform Admin",
  description: "Platform administration dashboard for Stacknity",
  keywords: ["platform", "admin", "dashboard", "stacknity"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline anti-FOUC theme script: runs before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {try {const ls = localStorage.getItem('theme');const mql = window.matchMedia('(prefers-color-scheme: dark)');const theme = ls === 'light' || ls === 'dark' ? ls : (mql.matches ? 'dark' : 'light');const doc = document.documentElement; if(!doc.classList.contains(theme)){doc.classList.remove('light','dark');doc.classList.add(theme);} } catch(e) { /* silent */ }})();`,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider loadFonts={true}>
            <AuthNavigationHandler />
            {children}

            {/* Floating theme toggle in bottom right corner */}
            <ThemeToggleButton />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
