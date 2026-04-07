import { motion } from "framer-motion";
import { StatCard } from "@/components/StatCard";
import { Users, TrendingUp, ArrowUpDown, Gamepad2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function AnalyticsPage() {
  const { data: stats } = useQuery({
    queryKey: ["analytics-stats"],
    queryFn: async () => {
      const [projects, profiles, messages, proposals] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("messages").select("*", { count: "exact", head: true }),
        supabase.from("proposals").select("*", { count: "exact", head: true }),
      ]);
      return {
        projects: projects.count || 0,
        users: profiles.count || 0,
        messages: messages.count || 0,
        proposals: proposals.count || 0,
      };
    },
  });

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform performance overview — real data</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={String(stats?.users || 0)} icon={Users} delay={0} />
        <StatCard title="Total Projects" value={String(stats?.projects || 0)} icon={Gamepad2} delay={0.1} />
        <StatCard title="Messages Sent" value={String(stats?.messages || 0)} icon={ArrowUpDown} delay={0.2} />
        <StatCard title="Proposals" value={String(stats?.proposals || 0)} icon={TrendingUp} delay={0.3} />
      </div>

      <div className="glass-card p-8 text-center">
        <p className="text-muted-foreground">
          Charts will populate as more data is added to the platform. All metrics above are real-time from the database.
        </p>
      </div>
    </div>
  );
}
