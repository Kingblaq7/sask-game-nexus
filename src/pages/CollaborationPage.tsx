import { motion } from "framer-motion";
import { MessageSquare, Send, Paperclip } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function CollaborationPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [msg, setMsg] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Auto-select first project
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0].id);
    }
  }, [projects, selectedProject]);

  const { data: messages = [] } = useQuery({
    queryKey: ["messages", selectedProject],
    queryFn: async () => {
      if (!selectedProject) return [];
      const { data, error } = await supabase
        .from("messages")
        .select("*, profiles(username)")
        .eq("project_id", selectedProject)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!selectedProject,
  });

  // Realtime messages
  useEffect(() => {
    if (!selectedProject) return;
    const channel = supabase
      .channel(`messages-${selectedProject}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `project_id=eq.${selectedProject}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ["messages", selectedProject] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedProject, queryClient]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useMutation({
    mutationFn: async () => {
      if (!user || !selectedProject || !msg.trim()) throw new Error("Missing data");
      const { error } = await supabase.from("messages").insert({
        project_id: selectedProject,
        user_id: user.id,
        message: msg.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setMsg("");
      queryClient.invalidateQueries({ queryKey: ["messages", selectedProject] });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (msg.trim()) sendMessage.mutate();
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Collaboration</h1>
        <p className="text-muted-foreground text-sm mt-1">Real-time project workspace</p>
      </div>

      {/* Project selector */}
      {projects.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {projects.map((p: any) => (
            <button
              key={p.id}
              onClick={() => setSelectedProject(p.id)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                selectedProject === p.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      <div className="glass-card flex flex-col h-[500px]">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">
            {projects.find((p: any) => p.id === selectedProject)?.name || "Select a project"}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!selectedProject ? (
            <p className="text-center text-muted-foreground text-sm py-8">
              Create a project first to start chatting
            </p>
          ) : messages.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8">
              No messages yet. Start the conversation!
            </p>
          ) : (
            messages.map((m: any, i: number) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.5) }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] text-primary-foreground font-bold">
                    {(m.profiles?.username || "U")[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{m.profiles?.username || "Unknown"}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground ml-8">{m.message}</p>
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {selectedProject && (
          <form onSubmit={handleSend} className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-muted/30 rounded-lg px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <button
                type="submit"
                disabled={!msg.trim() || sendMessage.isPending}
                className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
