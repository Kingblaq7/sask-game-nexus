import { StatCard } from "@/components/StatCard";
import { Users, Wallet, Gamepad2, TrendingUp, Clock } from "lucide-react";
import { motion } from "framer-motion";

const activities = [
  { text: "CryptoSlots project reached 'Live' status", time: "2h ago" },
  { text: "New proposal: Integrate Base NFT marketplace", time: "4h ago" },
  { text: "Revenue split updated for BetChain Pool", time: "6h ago" },
  { text: "SmartDice contract deployed on Base", time: "1d ago" },
  { text: "3 new members joined CasinoDAO", time: "1d ago" },
];

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back, Builder</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Projects" value="12" change="+3 this week" icon={Gamepad2} delay={0} />
        <StatCard title="Total Users" value="2,847" change="+12%" icon={Users} delay={0.1} />
        <StatCard title="Treasury" value="142.5 ETH" change="+8.3%" icon={Wallet} delay={0.2} />
        <StatCard title="Revenue" value="$48.2K" change="+24%" icon={TrendingUp} delay={0.3} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Projects */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="font-display font-semibold mb-4">Active Projects</h2>
          <div className="space-y-3">
            {["CryptoSlots", "BetChain Pool", "NFT Arena", "SmartDice"].map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Gamepad2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{name}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  i === 0 ? "bg-success/10 text-success" : i === 3 ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"
                }`}>
                  {i === 0 ? "Live" : i === 3 ? "Building" : "In Progress"}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {activities.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-3"
              >
                <Clock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm">{a.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
