import { motion } from "framer-motion";
import { useState } from "react";

const initialSplits = [
  { name: "Alice (Lead Dev)", pct: 35, color: "from-primary to-blue-400" },
  { name: "Bob (Smart Contracts)", pct: 25, color: "from-accent to-purple-400" },
  { name: "Charlie (Design)", pct: 20, color: "from-success to-emerald-400" },
  { name: "Treasury", pct: 15, color: "from-warning to-amber-400" },
  { name: "Community Fund", pct: 5, color: "from-destructive to-red-400" },
];

export default function RevenuePage() {
  const [splits, setSplits] = useState(initialSplits);
  const total = splits.reduce((s, x) => s + x.pct, 0);

  const updatePct = (i: number, val: number) => {
    const next = [...splits];
    next[i] = { ...next[i], pct: val };
    setSplits(next);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Revenue Splits</h1>
        <p className="text-muted-foreground text-sm mt-1">CryptoSlots — Revenue Distribution</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h2 className="font-display font-semibold mb-6">Distribution</h2>
          <div className="space-y-5">
            {splits.map((s, i) => (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{s.name}</span>
                  <span className="text-sm text-primary font-mono">{s.pct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={s.pct}
                  onChange={(e) => updatePct(i, Number(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
            ))}
          </div>
          <div className={`mt-6 p-3 rounded-lg text-sm font-medium text-center ${
            total === 100 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
          }`}>
            Total: {total}% {total !== 100 && "(Must equal 100%)"}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h2 className="font-display font-semibold mb-6">Preview</h2>
          {/* Simple bar chart */}
          <div className="space-y-3">
            {splits.map((s) => (
              <div key={s.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{s.name}</span>
                  <span className="font-mono">${((s.pct / 100) * 48200).toFixed(0)}</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${s.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${s.pct}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <button className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold hover:opacity-90 transition-opacity glow-primary">
              Execute Payout
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
