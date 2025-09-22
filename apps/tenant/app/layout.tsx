import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stacknity Tenant Workspace",
  description: "Tenant workspace for collaboration and productivity",
  keywords: ["tenant", "workspace", "collaboration", "stacknity"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="tenant-workspace">
          <header className="tenant-header">
            <nav className="tenant-nav">
              <h1>Tenant Workspace</h1>
              {/* Navigation will be added here */}
            </nav>
          </header>
          <main className="tenant-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
