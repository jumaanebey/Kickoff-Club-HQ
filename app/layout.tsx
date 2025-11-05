import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { CookieBanner } from "@/components/cookie-banner";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  metadataBase: new URL('https://kickoffclubhq.com'),
  title: {
    default: "Kickoff Club HQ - Master Football with Expert Coaches",
    template: "%s | Kickoff Club HQ"
  },
  description: "Learn from the best. Train like a pro. Elevate your game with comprehensive video courses designed by championship coaches. 50+ expert courses, 10k+ active students.",
  keywords: [
    "football training",
    "football courses",
    "football coaching",
    "quarterback training",
    "football fundamentals",
    "online sports education",
    "football drills",
    "football technique",
    "sports learning platform",
    "football certification"
  ],
  authors: [{ name: "Kickoff Club HQ" }],
  creator: "Kickoff Club HQ",
  publisher: "Kickoff Club HQ",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kickoffclubhq.com",
    siteName: "Kickoff Club HQ",
    title: "Kickoff Club HQ - Master Football with Expert Coaches",
    description: "Learn from the best. Train like a pro. Comprehensive football training with 50+ expert courses and 10k+ active students.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kickoff Club HQ - Football Training Platform"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kickoff Club HQ - Master Football with Expert Coaches",
    description: "Learn from the best. Train like a pro. 50+ expert courses from championship coaches.",
    images: ["/og-image.png"],
    creator: "@kickoffclubhq"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang="en">
      <body className={inter.className}>
        {gaId && <GoogleAnalytics gaId={gaId} />}
        {children}
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  );
}
