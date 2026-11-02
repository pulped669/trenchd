import type { Metadata } from "next";
import RadarDashboard from "@/components/radar/RadarDashboard";

export const metadata: Metadata = {
  title: "Radar — trenchd",
  description: "Live narratives across pump.fun, DexScreener and crypto Twitter, and what to launch into them.",
  robots: { index: false, follow: false },
};

export default function RadarPage() {
  return <RadarDashboard />;
}
