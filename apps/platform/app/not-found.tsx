import { Metadata } from "next";
import NotFound from "@/components/not-found/NotFound";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Stacknity",
  description:
    "The page you're looking for could not be found. Return to Stacknity to continue your journey.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFoundPage() {
  return <NotFound />;
}
