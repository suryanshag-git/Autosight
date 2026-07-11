import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
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
  title: "Qualia - AI Qualitative Research Platform",
  description: "Evidence-backed qualitative research analysis and insight synthesis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex bg-[#0b0f19] text-slate-100 overflow-hidden`}
      >
        <Sidebar />
        <main className="flex-1 flex flex-col h-screen overflow-y-auto p-8 lg:p-12">
          {children}
        </main>
      </body>
    </html>
  );
}
