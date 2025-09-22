import { Metadata } from "next";
import AuthContainer from "@/components/auth/AuthContainer";

export const metadata: Metadata = {
  title: "Sign In | Stacknity",
  description:
    "Sign in to your Stacknity account to access your dashboard and manage your projects.",
  keywords: ["login", "signin", "authentication", "stacknity"],
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <AuthContainer />;
}
