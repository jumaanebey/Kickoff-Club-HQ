import type { Metadata } from "next";
import { Inter, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { CookieBanner } from "@/components/cookie-banner";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { WebVitals } from "@/components/analytics/web-vitals";
import { SWRProvider } from "@/components/providers/swr-provider";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: 'swap',
  variable: '--font-heading',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kickoffclubhq.com'),
  title: {
    default: "Kickoff Club HQ - Learn Football Basics | No Judgment, No Gatekeeping",
    template: "%s | Kickoff Club HQ"
  },
  description: "Finally understand football. Free beginner-friendly lessons covering downs, field layout, scoring, and more. From 'what's a down?' to confident fan in bite-sized videos.",
  keywords: [
    "learn football",
    "football for beginners",
    "what are downs in football",
    "football basics",
    "football explained",
    "NFL for beginners",
    "how football works",
    "football field explained",
    "football scoring explained",
    "beginner football lessons"
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
    title: "Kickoff Club HQ - Learn Football Basics | No Judgment, No Gatekeeping",
    description: "Finally understand football. Free beginner-friendly lessons on downs, field layout, scoring & more. Perfect for new fans ready to enjoy the game.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kickoff Club HQ - Learn Football for Beginners"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kickoff Club HQ - Learn Football Basics",
    description: "Finally understand football. Free lessons for beginners - no judgment, no gatekeeping. Start your free training today!",
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
      <head>
        {/* Resource Hints for Performance */}
        {/* DNS Prefetch - Start DNS resolution early */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />

        {/* Preconnect - Complete connection (DNS + TCP + TLS) early for critical origins */}
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://vitals.vercel-insights.com" crossOrigin="anonymous" />

        {/* Preconnect to Supabase for faster database queries */}
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} crossOrigin="anonymous" />
        )}
      </head>
      <body className={`${inter.className} ${barlowCondensed.variable}`}>
        {gaId && <GoogleAnalytics gaId={gaId} />}
        <SWRProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </SWRProvider>
        <CookieBanner />
        <Analytics />
        <WebVitals />
      </body>
    </html>
  );
}
