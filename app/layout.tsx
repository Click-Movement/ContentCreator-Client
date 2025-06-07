import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "@/components/NavBar";
import { Toaster } from "sonner";
import { AuthToast } from "@/components/auth/auth-toast";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Content Rewriter - AI-Powered Content Transformation",
  description: "Transform your content with AI-powered rewriting in different personas and styles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
        <NavBar />
        {children}
        <Toaster position="top-right" />
        <AuthToast />
        </QueryProvider>
      </body>
    </html>
  );  
}
