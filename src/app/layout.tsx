import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skill Intelligence Platform",
  description:
    "Holistic Skill Intelligence System for Healthcare, Agriculture & Smart Cities",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient antialiased text-white">
        <div className="pointer-events-none fixed inset-0 bg-grid opacity-40" />

        <main className="relative mx-auto min-h-screen max-w-7xl px-4 py-6">
          {children}
        </main>

        <footer className="relative mx-auto max-w-7xl px-4 py-6 text-center text-sm text-muted">
          © {new Date().getFullYear()} Skill Intelligence · Hackathon Project
        </footer>
      </body>
    </html>
  );
}
