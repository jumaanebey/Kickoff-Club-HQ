import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kickoff Club HQ - Master Football Fundamentals",
  description: "Professional football training made accessible. Learn the game with expert coaches through structured video courses, progress tracking, and community support.",
  keywords: ["football", "training", "education", "coaching", "sports", "learning"],
  authors: [{ name: "Kickoff Club HQ" }],
  openGraph: {
    title: "Kickoff Club HQ - Master Football Fundamentals",
    description: "Professional football training made accessible online",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
