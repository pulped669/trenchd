import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WalletProvider from "@/context/WalletProvider";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-geist-sans",
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
        <WalletProvider>
          <Navbar />
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#111111",
                color: "#f0f0f0",
                border: "1px solid #1a1a1a",
              },
            }}
          />
        </WalletProvider>
      </body>
    </html>
  );
}
