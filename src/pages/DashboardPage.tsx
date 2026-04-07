import { StatCard } from "@/components/StatCard";
import { Users, Wallet, Gamepad2, TrendingUp, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [projects, profiles, messages] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: false }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("messages").select("*", { count: "exact", head: true }),
      ]);
      return {
        projectCount: projects.data?.length || 0,
        projects: projects.data || [],
        userCount: profiles.count || 0,
        messageCount: messages.count || 0,
      };
    },
  });

  const { data: recentMessages = [] } = useQuery({
    queryKey: ["recent-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*, profiles(username)")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  const statusColors: Record<string, string> = {
    live: "bg-success/10 text-success",
    building: "bg-warning/10 text-warning",
    idea: "bg-primary/10 text-primary",
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back, Builder</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Projects" value={String(stats?.projectCount || 0)} icon={Gamepad2} delay={0} />
        <StatCard title="Total Users" value={String(stats?.userCount || 0)} icon={Users} delay={0.1} />
        <StatCard title="Messages" value={String(stats?.messageCount || 0)} icon={Wallet} delay={0.2} />
        <StatCard title="Your Projects" value={String(stats?.projects?.filter((p: any) => p.creator_id === user?.id).length || 0)} icon={TrendingUp} delay={0.3} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="font-display font-semibold mb-4">Active Projects</h2>
          {stats?.projects && stats.projects.length > 0 ? (
            <div className="space-y-3">
              {stats.projects.slice(0, 5).map((p: any, i: number) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Gamepad2 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{p.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${statusColors[p.status] || statusColors.idea}`}>
                    {p.status}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No projects yet</p>
          )}
        </div>

        <div className="glass-card p-6">
          <h2 className="font-display font-semibold mb-4">Recent Activity</h2>
          {recentMessages.length > 0 ? (
            <div className="space-y-4">
              {recentMessages.map((m: any, i: number) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-3"
                >
                  <Clock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{m.profiles?.username || "User"}</span>: {m.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(m.created_at).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}
