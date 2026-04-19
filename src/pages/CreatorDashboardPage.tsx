import { motion } from "framer-motion";
import { Crown, FolderPlus, Users, DollarSign, Rocket, ArrowRight, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";
import { StatCard } from "@/components/StatCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function CreatorDashboardPage() {
  const { user } = useAuth();

  const { data: projects = [] } = useQuery({
    queryKey: ["creator-projects", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("creator_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const liveCount = projects.filter((p: any) => p.status === "live").length;

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
          <Crown className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Creator Studio</h1>
          <p className="text-muted-foreground text-sm">Launch and grow your gaming projects</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Your Projects" value={String(projects.length)} icon={Gamepad2} delay={0} />
        <StatCard title="Live Games" value={String(liveCount)} icon={Rocket} delay={0.1} />
        <StatCard title="Team Members" value="—" icon={Users} delay={0.2} />
        <StatCard title="Revenue" value="$0" icon={DollarSign} delay={0.3} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Link
          to="/projects"
          className="glass-card p-6 hover:border-primary/40 border border-transparent transition-colors group"
        >
          <FolderPlus className="w-6 h-6 text-primary mb-3" />
          <h3 className="font-display font-semibold mb-1">Create new project</h3>
          <p className="text-xs text-muted-foreground mb-3">Start a new gaming project from scratch</p>
          <span className="text-xs text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            Open projects <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        <Link to="/revenue" className="glass-card p-6 hover:border-primary/40 border border-transparent transition-colors group">
          <DollarSign className="w-6 h-6 text-primary mb-3" />
          <h3 className="font-display font-semibold mb-1">Revenue overview</h3>
          <p className="text-xs text-muted-foreground mb-3">Track earnings and revenue splits</p>
          <span className="text-xs text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            View revenue <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        <Link to="/contracts" className="glass-card p-6 hover:border-primary/40 border border-transparent transition-colors group">
          <Rocket className="w-6 h-6 text-primary mb-3" />
          <h3 className="font-display font-semibold mb-1">Launch on-chain</h3>
          <p className="text-xs text-muted-foreground mb-3">Deploy smart contracts on Base</p>
          <span className="text-xs text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            Smart Contracts <ArrowRight className="w-3 h-3" />
          </span>
        </Link>
      </div>

      <div className="glass-card p-6">
        <h2 className="font-display font-semibold mb-4">Manage your projects</h2>
        {projects.length === 0 ? (
          <div className="text-center py-10">
            <Gamepad2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-4">You haven't created any projects yet.</p>
            <Link to="/projects" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
              <FolderPlus className="w-4 h-4" /> Create your first project
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((p: any, i: number) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Gamepad2 className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.description || "No description"}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full capitalize bg-primary/10 text-primary flex-shrink-0">
                  {p.status}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
