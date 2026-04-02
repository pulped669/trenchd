import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/context/SessionProvider";
import HeavenBackground from "@/components/HeavenBackground";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "TRENCHD",
  description: "Autonomous Solana trading.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body>
        <SessionProvider>
          <HeavenBackground />
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: "rgba(255,255,255,0.9)",
                color: "#1a1a2e",
                border: "1px solid rgba(0,0,0,0.06)",
                backdropFilter: "blur(20px)",
                borderRadius: "100px",
                fontSize: "14px",
                padding: "12px 24px",
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
