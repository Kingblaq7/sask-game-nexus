import { motion } from "framer-motion";
import { FileCode2, Rocket, Clock, CheckCircle2, ExternalLink } from "lucide-react";

const templates = [
  { name: "Casino Slots", desc: "Provably fair slot machine with configurable paylines", status: "deployed", address: "0x1a2b...8f3d" },
  { name: "Dice Game", desc: "Simple dice roll with adjustable house edge", status: "deployed", address: "0x4c5d...2e1a" },
  { name: "Betting Pool", desc: "Multi-outcome betting pool with automatic settlement", status: "pending", address: null },
  { name: "NFT Lootbox", desc: "Randomized NFT drops with verifiable fairness", status: "pending", address: null },
  { name: "Poker Contract", desc: "Heads-up poker with commit-reveal scheme", status: "draft", address: null },
  { name: "Roulette", desc: "European roulette with on-chain randomness", status: "draft", address: null },
];

const statusConfig: Record<string, { icon: typeof CheckCircle2; label: string; class: string }> = {
  deployed: { icon: CheckCircle2, label: "Deployed", class: "bg-success/10 text-success" },
  pending: { icon: Clock, label: "Pending", class: "bg-warning/10 text-warning" },
  draft: { icon: FileCode2, label: "Draft", class: "bg-muted text-muted-foreground" },
};

export default function ContractsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Smart Contracts</h1>
          <p className="text-muted-foreground text-sm mt-1">Deploy and manage game contracts on Base</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          + Deploy Template
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t, i) => {
          const sc = statusConfig[t.status];
          return (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card-hover p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileCode2 className="w-5 h-5 text-primary" />
                </div>
                <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${sc.class}`}>
                  <sc.icon className="w-3 h-3" /> {sc.label}
                </span>
              </div>
              <h3 className="font-display font-semibold">{t.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
              {t.address && (
                <div className="mt-3 flex items-center gap-1 text-xs text-primary">
                  <span className="font-mono">{t.address}</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              )}
              {t.status === "draft" && (
                <button className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium">
                  <Rocket className="w-4 h-4" /> Deploy
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
