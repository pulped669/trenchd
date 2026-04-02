"use client";

const prices = [
  { symbol: "BTC", price: "$98,420", change: "+2.4%" , up: true },
  { symbol: "ETH", price: "$3,812", change: "+1.8%", up: true },
  { symbol: "SOL", price: "$178.50", change: "+5.2%", up: true },
  { symbol: "XRP", price: "$2.14", change: "-0.8%", up: false },
  { symbol: "BNB", price: "$612", change: "+0.3%", up: true },
  { symbol: "DOGE", price: "$0.182", change: "+3.1%", up: true },
  { symbol: "ADA", price: "$0.72", change: "-1.2%", up: false },
  { symbol: "AVAX", price: "$41.20", change: "+4.6%", up: true },
  { symbol: "DOT", price: "$8.95", change: "+1.1%", up: true },
  { symbol: "LINK", price: "$18.40", change: "+2.9%", up: true },
];

export default function PriceTicker() {
  return (
    <div className="border-b border-border bg-bg-secondary/50">
      <div className="mx-auto flex max-w-6xl items-center gap-6 overflow-x-auto px-4 py-2 scrollbar-none">
        {prices.map((p) => (
          <div key={p.symbol} className="flex shrink-0 items-center gap-2 text-[12px]">
            <span className="font-semibold text-fg">{p.symbol}</span>
            <span className="text-fg-secondary">{p.price}</span>
            <span className={p.up ? "font-medium text-emerald-500" : "font-medium text-red-500"}>
              {p.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
