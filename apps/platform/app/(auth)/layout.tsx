import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    template: "%s | Stacknity Auth",
    default: "Authentication | Stacknity",
  },
  description: "Secure authentication for Stacknity platform",
  robots: {
    index: false,
    follow: false,
  },
};

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      {/* Auth-specific layout wrapper */}
      <main className="auth-main">{children}</main>
    </div>
  );
}
