import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Montserrat, Roboto_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://keyflow-brown.vercel.app"),
  title: {
    default: "Keyflow | Focused typing practice",
    template: "%s | Keyflow",
  },
  description:
    "A minimal typing trainer with live WPM, accuracy, a visual keyboard, and local progress tracking. No account required.",
  keywords: [
    "typing test",
    "wpm",
    "accuracy",
    "keyboard trainer",
    "monkeytype alternative",
  ],
  openGraph: {
    title: "Keyflow | Focused typing practice",
    description:
      "Start typing immediately. Track speed, accuracy, and progress in the browser.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Keyflow",
    description: "A calm typing trainer with live WPM and accuracy.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${robotoMono.variable} antialiased`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-card focus:px-3 focus:py-2"
        >
          Skip to typing
        </a>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
