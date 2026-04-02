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
  title: "trenchd — launch tokens on Solana",
  description:
    "The fastest way to create and trade tokens on Solana. Fair launch bonding curves with automatic DEX graduation.",
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
                background: "rgba(17, 17, 19, 0.9)",
                color: "#f5f5f7",
                border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(20px)",
                borderRadius: "12px",
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
