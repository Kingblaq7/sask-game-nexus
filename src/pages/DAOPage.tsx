import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, Clock, CheckCircle2, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { getProposals, createProposal, castVote, type Proposal } from "@/lib/localStore";

export default function DAOPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [proposals, setProposals] = useState<Proposal[]>(getProposals);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const refresh = useCallback(() => setProposals(getProposals()), []);

  const handleCreate = () => {
    if (!user || !title) return;
    try {
      createProposal({ title, description, creator: user.email });
      refresh();
      setShowForm(false);
      setTitle("");
      setDescription("");
      toast({ title: "Proposal created!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleVote = (proposalId: string, vote: "yes" | "no") => {
    if (!user) return;
    try {
      castVote(proposalId, user.email, vote);
      refresh();
      toast({ title: "Vote cast!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">DAO Voting</h1>
          <p className="text-muted-foreground text-sm mt-1">Govern the platform with token-based voting</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          + New Proposal
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">Create Proposal</h3>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>
          <div className="space-y-3">
            <input placeholder="Proposal title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-muted/30 rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full bg-muted/30 rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none" />
            <button onClick={handleCreate} disabled={!title} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
              Create Proposal
            </button>
          </div>
        </motion.div>
      )}

      {proposals.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-muted-foreground">No proposals yet. Create the first one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map((p, i) => {
            const total = p.votes_yes + p.votes_no;
            const yesPct = total > 0 ? Math.round((p.votes_yes / total) * 100) : 0;
            const voted = p.voters.some((v) => v.user === user?.email);

            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card-hover p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {p.status === "active" ? (
                        <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-success/10 text-success"><Clock className="w-3 h-3" /> Active</span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"><CheckCircle2 className="w-3 h-3" /> Closed</span>
                      )}
                    </div>
                    <h3 className="font-display font-semibold text-lg">{p.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="flex items-center gap-1 text-success"><ThumbsUp className="w-3 h-3" /> Yes {yesPct}%</span>
                    <span className="flex items-center gap-1 text-destructive"><ThumbsDown className="w-3 h-3" /> No {total > 0 ? 100 - yesPct : 0}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-success to-primary" style={{ width: `${yesPct}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{total} total votes</p>
                </div>

                {p.status === "active" && !voted && (
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => handleVote(p.id, "yes")} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors text-sm font-medium">
                      <ThumbsUp className="w-4 h-4" /> Vote Yes
                    </button>
                    <button onClick={() => handleVote(p.id, "no")} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm font-medium">
                      <ThumbsDown className="w-4 h-4" /> Vote No
                    </button>
                  </div>
                )}
                {voted && <p className="text-xs text-muted-foreground mt-4 text-center">You already voted on this proposal</p>}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
