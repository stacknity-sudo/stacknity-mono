import { Suspense } from "react";
import { Verify } from "@/components/auth/Verify";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email | Stacknity",
  description:
    "Verify your email address to complete your Stacknity account setup",
  robots: {
    index: false,
    follow: false,
  },
};

function VerifyFallback() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "1.2rem",
        color: "var(--text-secondary)",
      }}
    >
      Loading verification...
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyFallback />}>
      <Verify />
    </Suspense>
  );
}
