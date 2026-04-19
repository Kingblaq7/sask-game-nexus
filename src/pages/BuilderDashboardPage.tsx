import { motion } from "framer-motion";
import { Wrench, Code2, MessagesSquare, Trophy, ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { StatCard } from "@/components/StatCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function BuilderDashboardPage() {
  const { user } = useAuth();

  const { data: openProjects = [] } = useQuery({
    queryKey: ["builder-open-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .in("status", ["idea", "building"])
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return data;
    },
  });

  const { data: myMemberships = [] } = useQuery({
    queryKey: ["builder-memberships", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_members")
        .select("project_id, projects(name, status)")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
          <Wrench className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Builder Workspace</h1>
          <p className="text-muted-foreground text-sm">Find projects to contribute to and ship code</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Joined Projects" value={String(myMemberships.length)} icon={Code2} delay={0} />
        <StatCard title="Open Projects" value={String(openProjects.length)} icon={Search} delay={0.1} />
        <StatCard title="Active Tasks" value="0" icon={Wrench} delay={0.2} />
        <StatCard title="Contribution Score" value="0" icon={Trophy} delay={0.3} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold">Browse projects to join</h2>
            <Link to="/projects" className="text-xs text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {openProjects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No open projects right now.</p>
          ) : (
            <div className="space-y-2">
              {openProjects.map((p: any, i: number) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.description || "Looking for builders"}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full capitalize bg-cyan-500/10 text-cyan-400 flex-shrink-0">
                    {p.status}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Link to="/collaboration" className="glass-card p-6 block hover:border-primary/40 border border-transparent transition-colors group">
            <MessagesSquare className="w-6 h-6 text-primary mb-3" />
            <h3 className="font-display font-semibold mb-1">Collaboration tools</h3>
            <p className="text-xs text-muted-foreground mb-3">Chat with teams and coordinate work</p>
            <span className="text-xs text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              Open collaboration <ArrowRight className="w-3 h-3" />
            </span>
          </Link>

          <div className="glass-card p-6">
            <h3 className="font-display font-semibold mb-3">Your contributions</h3>
            {myMemberships.length === 0 ? (
              <p className="text-sm text-muted-foreground">You haven't joined any project yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {myMemberships.map((m: any) => (
                  <li key={m.project_id} className="flex items-center justify-between">
                    <span className="truncate">{m.projects?.name || "Project"}</span>
                    <span className="text-xs text-muted-foreground capitalize">{m.projects?.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
