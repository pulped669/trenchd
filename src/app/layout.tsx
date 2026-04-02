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
  description: "AI that watches your trades and corrects your flaws.",
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
                background: "rgba(15,23,42,0.9)",
                color: "#e2e8f0",
                border: "1px solid rgba(148,163,184,0.08)",
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
