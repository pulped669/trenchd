"use client";

const trades = [
  { pair: "SOL/USDC", action: "BUY", pnl: "+12.4%", time: "2m" },
  { pair: "WIF/SOL", action: "SELL", pnl: "+8.7%", time: "5m" },
  { pair: "JUP/USDC", action: "BUY", pnl: "+23.1%", time: "8m" },
  { pair: "BONK/SOL", action: "SELL", pnl: "+5.2%", time: "12m" },
  { pair: "RAY/USDC", action: "BUY", pnl: "+16.8%", time: "15m" },
  { pair: "ORCA/SOL", action: "BUY", pnl: "+9.3%", time: "18m" },
  { pair: "PYTH/USDC", action: "SELL", pnl: "+31.5%", time: "22m" },
  { pair: "RENDER/SOL", action: "BUY", pnl: "+14.2%", time: "25m" },
];

export default function LiveTicker() {
  const doubled = [...trades, ...trades];

  return (
    <div className="relative overflow-hidden border-y border-cyan/10 bg-surface/80 py-3 backdrop-blur-sm">
      <div className="absolute left-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <div className="animate-ticker flex items-center gap-10 whitespace-nowrap">
        {doubled.map((trade, i) => (
          <div key={i} className="flex items-center gap-2 font-mono text-[12px]">
            <span className="font-semibold text-foreground/80">{trade.pair}</span>
            <span className={`font-bold ${trade.action === "BUY" ? "text-green" : "text-pink"}`}>
              {trade.action}
            </span>
            <span className="text-green">{trade.pnl}</span>
            <span className="text-muted/30">{trade.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
