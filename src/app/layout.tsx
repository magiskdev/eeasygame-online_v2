import type { Metadata } from "next";
import "./globals.css";
import { PageShell } from "shared/ui/PageShell";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["cyrillic"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "eeasygame.online — мини-игры",
  description: "Онлайн-платформа мини-игр: Flappy Bird и игры для компаний.",
  metadataBase: new URL("https://eeasygame.online")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="ru" className={inter.className}><body><PageShell>{children}</PageShell></body></html>);
}
