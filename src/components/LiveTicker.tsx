"use client";

const trades = [
  { pair: "SOL/USDC", action: "BUY", pnl: "+12.4%", time: "2m ago" },
  { pair: "WIF/SOL", action: "SELL", pnl: "+8.7%", time: "5m ago" },
  { pair: "JUP/USDC", action: "BUY", pnl: "+23.1%", time: "8m ago" },
  { pair: "BONK/SOL", action: "SELL", pnl: "+5.2%", time: "12m ago" },
  { pair: "RAY/USDC", action: "BUY", pnl: "+16.8%", time: "15m ago" },
  { pair: "ORCA/SOL", action: "BUY", pnl: "+9.3%", time: "18m ago" },
  { pair: "PYTH/USDC", action: "SELL", pnl: "+31.5%", time: "22m ago" },
  { pair: "RENDER/SOL", action: "BUY", pnl: "+14.2%", time: "25m ago" },
];

export default function LiveTicker() {
  const doubled = [...trades, ...trades];

  return (
    <div className="relative overflow-hidden border-y border-border bg-surface/50 py-3">
      <div className="absolute left-0 top-0 bottom-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />
      <div className="animate-ticker flex items-center gap-8 whitespace-nowrap">
        {doubled.map((trade, i) => (
          <div key={i} className="flex items-center gap-3 text-[13px]">
            <span className="font-mono font-medium text-foreground">
              {trade.pair}
            </span>
            <span
              className={`rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold ${
                trade.action === "BUY"
                  ? "bg-green/10 text-green"
                  : "bg-red/10 text-red"
              }`}
            >
              {trade.action}
            </span>
            <span className="font-mono text-green">{trade.pnl}</span>
            <span className="text-muted/40">{trade.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
