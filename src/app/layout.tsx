import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { CompareBar } from "@/components/compare/CompareBar";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CollegeFinder",
  description: "Find and compare colleges",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geist.className} bg-gray-50 text-gray-900 antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[var(--radius)] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--sapphire)] focus:shadow-[var(--shadow)]"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main-content" className="mx-auto max-w-7xl px-4 py-6 pb-28 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
        <CompareBar />
      </body>
    </html>
  );
}
