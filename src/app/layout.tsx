import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "trench'd — random video chat with strangers",
  description:
    "Drop into the trench. Get matched with a random stranger over video, chat, skip, repeat. No sign-up.",
  applicationName: "trench'd",
  openGraph: {
    title: "trench'd",
    description: "Random video chat with strangers. One tap, no sign-up.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "trench'd",
    description: "Random video chat with strangers. One tap, no sign-up.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0612",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body>
        <div className="aurora" aria-hidden />
        {children}
      </body>
    </html>
  );
}
