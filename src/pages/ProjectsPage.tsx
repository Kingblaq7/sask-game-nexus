import { motion } from "framer-motion";
import { Gamepad2, Users, ExternalLink } from "lucide-react";

const projects = [
  { name: "CryptoSlots", desc: "Provably fair slot machine with on-chain RNG", status: "Live", chain: "Base", members: 8 },
  { name: "BetChain Pool", desc: "Decentralized sports betting liquidity pool", status: "Building", chain: "Base", members: 5 },
  { name: "NFT Arena", desc: "PvP card game with NFT-based characters", status: "Idea", chain: "Base", members: 3 },
  { name: "SmartDice", desc: "On-chain dice game with customizable odds", status: "Building", chain: "Base", members: 6 },
  { name: "LootBox Protocol", desc: "Transparent lootbox system with verifiable drops", status: "Idea", chain: "Base", members: 2 },
  { name: "CasinoDAO", desc: "Community-governed casino platform", status: "Live", chain: "Base", members: 14 },
];

const statusColors: Record<string, string> = {
  Live: "bg-success/10 text-success",
  Building: "bg-warning/10 text-warning",
  Idea: "bg-primary/10 text-primary",
};

export default function ProjectsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">Create and join Web3 gaming projects</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          + New Project
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card-hover p-5 flex flex-col"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-primary" />
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[p.status]}`}>{p.status}</span>
            </div>
            <h3 className="font-display font-semibold">{p.name}</h3>
            <p className="text-sm text-muted-foreground mt-1 flex-1">{p.desc}</p>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="w-3.5 h-3.5" /> {p.members} members
              </div>
              <span className="text-xs text-primary flex items-center gap-1">
                {p.chain} <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
