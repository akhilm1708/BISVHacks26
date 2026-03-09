import type { Metadata } from "next";
import Link from "next/link";
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
  title: "ScamSaver — AI Scam Protection for Seniors",
  description: "Detect scams in messages, screenshots, and phone calls using AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `body { font-family: 'Plus Jakarta Sans', sans-serif; }`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav
          className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-[#f0f0f0]"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <div className="max-w-[1100px] mx-auto flex items-center justify-between h-[72px] px-8">
            <Link
              href="/"
              className="font-extrabold text-[1.4rem]"
              style={{ color: '#0f0f1a' }}
            >
              🛡️ ScamSaver
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/analyze"
                className="text-base font-medium text-gray-500 hover:text-blue-600 transition-colors"
              >
                Analyze
              </Link>
              <Link
                href="/screenshot"
                className="text-base font-medium text-gray-500 hover:text-blue-600 transition-colors"
              >
                Screenshot
              </Link>
              <Link
                href="/audio"
                className="text-base font-medium text-gray-500 hover:text-blue-600 transition-colors"
              >
                Audio
              </Link>
              <Link
                href="/live"
                className="text-base font-medium text-gray-500 hover:text-blue-600 transition-colors"
              >
                Live
              </Link>
              <Link
                href="/learn"
                className="text-base font-medium text-gray-500 hover:text-blue-600 transition-colors"
              >
                Learn
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
