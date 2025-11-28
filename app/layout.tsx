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
  title: "AI Wizualizator Domu PRO - Projektowanie z AI",
  description: "Przekształć swój dom z pomocą sztucznej inteligencji. Wybierz styl, materiały i zobacz fotorealistyczną wizualizację w czasie rzeczywistym. Gotowe presety i AI chat.",
  keywords: ["wizualizacja domu", "AI", "architektura", "elewacja", "dach", "projektowanie domu", "remont"],
  authors: [{ name: "AI Wizualizator Team" }],
  openGraph: {
    title: "AI Wizualizator Domu PRO",
    description: "Przekształć swój dom z pomocą sztucznej inteligencji",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
