import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/context/SessionProvider";
import Navbar from "@/components/Navbar";
import FloatingElements from "@/components/FloatingElements";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TRENCHD — Autonomous Solana Trading",
  description:
    "Fully autonomous Solana trading bot. Choose your strategy, set your risk, and let it run 24/7.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          <FloatingElements />
          <Navbar />
          <div className="relative z-10">{children}</div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "rgba(18, 0, 37, 0.95)",
                color: "#f0e6ff",
                border: "1px solid rgba(5, 217, 232, 0.15)",
                backdropFilter: "blur(20px)",
                borderRadius: "4px",
                fontFamily: "monospace",
                fontSize: "13px",
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
