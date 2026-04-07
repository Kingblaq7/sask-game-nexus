import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, Clock, CheckCircle2, XCircle } from "lucide-react";

const proposals = [
  {
    title: "Integrate Base NFT Marketplace",
    desc: "Add support for NFT trading within the platform to enable in-game asset trading.",
    yes: 234, no: 45, status: "active",
    endDate: "Apr 12, 2026",
  },
  {
    title: "Add Multi-Chain Support",
    desc: "Expand beyond Base to support Ethereum L1 and Arbitrum for broader reach.",
    yes: 189, no: 156, status: "active",
    endDate: "Apr 15, 2026",
  },
  {
    title: "Treasury Diversification",
    desc: "Allocate 20% of treasury to stablecoins to reduce volatility exposure.",
    yes: 312, no: 28, status: "closed",
    endDate: "Apr 1, 2026",
  },
  {
    title: "Community Rewards Program",
    desc: "Launch a points-based rewards system for active contributors and testers.",
    yes: 445, no: 12, status: "closed",
    endDate: "Mar 28, 2026",
  },
];

export default function DAOPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">DAO Voting</h1>
          <p className="text-muted-foreground text-sm mt-1">Govern the platform with token-based voting</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          + New Proposal
        </button>
      </div>

      <div className="space-y-4">
        {proposals.map((p, i) => {
          const total = p.yes + p.no;
          const yesPct = Math.round((p.yes / total) * 100);
          return (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-hover p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {p.status === "active" ? (
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-success/10 text-success"><Clock className="w-3 h-3" /> Active</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"><CheckCircle2 className="w-3 h-3" /> Closed</span>
                    )}
                    <span className="text-xs text-muted-foreground">Ends {p.endDate}</span>
                  </div>
                  <h3 className="font-display font-semibold text-lg">{p.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
                </div>
              </div>

              {/* Vote bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="flex items-center gap-1 text-success"><ThumbsUp className="w-3 h-3" /> Yes {yesPct}%</span>
                  <span className="flex items-center gap-1 text-destructive"><ThumbsDown className="w-3 h-3" /> No {100 - yesPct}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-success to-primary" style={{ width: `${yesPct}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">{total.toLocaleString()} total votes</p>
              </div>

              {p.status === "active" && (
                <div className="flex gap-3 mt-4">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors text-sm font-medium">
                    <ThumbsUp className="w-4 h-4" /> Vote Yes
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm font-medium">
                    <ThumbsDown className="w-4 h-4" /> Vote No
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
