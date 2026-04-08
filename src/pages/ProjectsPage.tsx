import { motion } from "framer-motion";
import { Gamepad2, Users, ExternalLink, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { getProjects, createProject, joinProject, type Project } from "@/lib/localStore";

const statusColors: Record<string, string> = {
  live: "bg-success/10 text-success",
  building: "bg-warning/10 text-warning",
  idea: "bg-primary/10 text-primary",
};

export default function ProjectsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>(getProjects);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("idea");

  const refresh = useCallback(() => setProjects(getProjects()), []);

  const handleCreate = () => {
    if (!user || !name) return;
    try {
      createProject({ name, description, status, creator: user.email });
      refresh();
      setShowForm(false);
      setName("");
      setDescription("");
      toast({ title: "Project created!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleJoin = (id: string) => {
    if (!user) return;
    try {
      joinProject(id, user.email);
      refresh();
      toast({ title: "Joined project!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">Create and join Web3 gaming projects</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          + New Project
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">Create Project</h3>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>
          <div className="space-y-3">
            <input placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-muted/30 rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full bg-muted/30 rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none" />
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-muted/30 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50">
              <option value="idea">Idea</option>
              <option value="building">Building</option>
              <option value="live">Live</option>
            </select>
            <button onClick={handleCreate} disabled={!name} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
              Create Project
            </button>
          </div>
        </motion.div>
      )}

      {projects.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Gamepad2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No projects yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card-hover p-5 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-primary" />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[p.status] || statusColors.idea}`}>{p.status}</span>
              </div>
              <h3 className="font-display font-semibold">{p.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 flex-1">{p.description}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="w-3.5 h-3.5" /> {p.members.length} members
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-primary flex items-center gap-1">{p.blockchain} <ExternalLink className="w-3 h-3" /></span>
                  {p.creator !== user?.email && !p.members.includes(user?.email || "") && (
                    <button onClick={() => handleJoin(p.id)} className="text-xs px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors">Join</button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
