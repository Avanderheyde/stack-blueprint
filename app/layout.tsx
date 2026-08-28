import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Tektur } from "next/font/google";
import "./globals.css";

const display = Tektur({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Stack Blueprint: Turn one software idea into a complete stack",
  description: "An automatic WebMCP architect that surveys tools, consults current Intel, and draws the complete software and AI-building stack.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
