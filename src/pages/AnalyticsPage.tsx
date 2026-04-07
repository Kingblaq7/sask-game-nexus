import { motion } from "framer-motion";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { StatCard } from "@/components/StatCard";
import { Users, TrendingUp, ArrowUpDown, Gamepad2 } from "lucide-react";

const revenueData = [
  { month: "Jan", revenue: 12400 },
  { month: "Feb", revenue: 18200 },
  { month: "Mar", revenue: 22100 },
  { month: "Apr", revenue: 19800 },
  { month: "May", revenue: 28500 },
  { month: "Jun", revenue: 35200 },
  { month: "Jul", revenue: 48200 },
];

const playerData = [
  { day: "Mon", players: 340 },
  { day: "Tue", players: 420 },
  { day: "Wed", players: 380 },
  { day: "Thu", players: 510 },
  { day: "Fri", players: 680 },
  { day: "Sat", players: 890 },
  { day: "Sun", players: 760 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-sm">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-semibold text-primary">{typeof payload[0].value === "number" && payload[0].value > 1000 ? `$${payload[0].value.toLocaleString()}` : payload[0].value}</p>
    </div>
  );
};

export default function AnalyticsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform performance overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Daily Players" value="2,847" change="+12%" icon={Users} delay={0} />
        <StatCard title="Monthly Revenue" value="$48.2K" change="+24%" icon={TrendingUp} delay={0.1} />
        <StatCard title="Transactions" value="14,392" change="+8%" icon={ArrowUpDown} delay={0.2} />
        <StatCard title="Active Games" value="6" change="+2" icon={Gamepad2} delay={0.3} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <h2 className="font-display font-semibold mb-6">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(225 15% 18%)" />
              <XAxis dataKey="month" stroke="hsl(215 15% 55%)" fontSize={12} />
              <YAxis stroke="hsl(215 15% 55%)" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(217 91% 60%)" strokeWidth={2} dot={{ fill: "hsl(217 91% 60%)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <h2 className="font-display font-semibold mb-6">Player Activity</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={playerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(225 15% 18%)" />
              <XAxis dataKey="day" stroke="hsl(215 15% 55%)" fontSize={12} />
              <YAxis stroke="hsl(215 15% 55%)" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="players" fill="hsl(263 70% 58%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
