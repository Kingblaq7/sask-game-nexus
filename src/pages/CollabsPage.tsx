import { motion } from "framer-motion";
import { Megaphone, X, Clock, CheckCircle2, DollarSign, Users, ArrowLeft, Send, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { addNotification } from "@/lib/notifications";
import {
  getCampaigns,
  createCampaign,
  getCampaignById,
  applyForCampaign,
  getApplicationsByCampaign,
  getApplicationsByUser,
  updateApplicationStatus,
  closeCampaign,
  getProjects,
  type Campaign,
  type Application,
} from "@/lib/localStore";

const statusBadge: Record<string, string> = {
  active: "bg-success/10 text-success",
  closed: "bg-muted text-muted-foreground",
  pending: "bg-warning/10 text-warning",
  approved: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
};

const rewardLabel: Record<string, string> = {
  USDT: "USDT",
  token: "Token",
  fixed: "Fixed Pay",
};

export default function CollabsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>(getCampaigns);
  const [showForm, setShowForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [showApplyForm, setShowApplyForm] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectName, setProjectName] = useState("");
  const [rewardType, setRewardType] = useState<Campaign["reward_type"]>("USDT");
  const [rewardAmount, setRewardAmount] = useState("");
  const [requirements, setRequirements] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [deadline, setDeadline] = useState("");

  // Apply form state
  const [applyMessage, setApplyMessage] = useState("");
  const [applyLinks, setApplyLinks] = useState("");

  const refresh = useCallback(() => setCampaigns(getCampaigns()), []);

  const handleCreate = () => {
    if (!user || !title || !projectName) return;
    try {
      createCampaign({
        project_name: projectName,
        title,
        description,
        reward_type: rewardType,
        reward_amount: parseFloat(rewardAmount) || 0,
        requirements,
        deliverables,
        deadline,
        creator: user.email,
      });
      refresh();
      setShowForm(false);
      setTitle("");
      setDescription("");
      setProjectName("");
      setRewardAmount("");
      setRequirements("");
      setDeliverables("");
      setDeadline("");
      toast({ title: "Campaign created!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleApply = (campaignId: string) => {
    if (!user) return;
    try {
      const campaign = getCampaignById(campaignId);
      const username = (user.user_metadata as any)?.username || user.email?.split("@")[0] || "user";
      applyForCampaign({
        campaign_id: campaignId,
        user_id: user.email ?? user.id,
        username,
        submission_links: applyLinks,
        message: applyMessage,
      });
      // Notify campaign creator
      if (campaign) {
        addNotification({
          user_id: campaign.creator,
          title: "New Application",
          message: `${username} applied to "${campaign.title}"`,
          type: "application",
          link: "/collabs",
        });
      }
      setShowApplyForm(false);
      setApplyMessage("");
      setApplyLinks("");
      toast({ title: "Application submitted!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleAppStatus = (appId: string, status: Application["status"]) => {
    try {
      // Get application before updating to notify user
      const apps = getApplicationsByCampaign(selectedCampaign || "");
      const app = apps.find((a) => a.id === appId);
      const campaign = selectedCampaign ? getCampaignById(selectedCampaign) : null;

      updateApplicationStatus(appId, status);

      // Notify the applicant
      if (app && campaign) {
        addNotification({
          user_id: app.user_id,
          title: status === "approved" ? "Application Approved! 🎉" : "Application Rejected",
          message: status === "approved"
            ? `Your application to "${campaign.title}" was approved! Earnings have been added.`
            : `Your application to "${campaign.title}" was rejected.`,
          type: "status",
          link: status === "approved" ? "/earnings" : "/collabs",
        });
      }

      toast({ title: `Application ${status}` });
      setSelectedCampaign((prev) => prev);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleClose = (id: string) => {
    if (!user) return;
    try {
      closeCampaign(id, user.email);
      refresh();
      setSelectedCampaign(null);
      toast({ title: "Campaign closed" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  // Detail view
  if (selectedCampaign) {
    const campaign = getCampaignById(selectedCampaign);
    if (!campaign) {
      setSelectedCampaign(null);
      return null;
    }
    const apps = getApplicationsByCampaign(campaign.id);
    const userApplied = apps.some((a) => a.user_id === user?.email);
    const isCreator = campaign.creator === user?.email;

    return (
      <div className="p-6 lg:p-8 space-y-6">
        <button onClick={() => setSelectedCampaign(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Campaigns
        </button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 lg:p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-xs text-primary font-medium">{campaign.project_name}</span>
              <h1 className="font-display text-2xl font-bold mt-1">{campaign.title}</h1>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusBadge[campaign.status]}`}>
              {campaign.status}
            </span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{campaign.description}</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="glass-card p-4">
              <p className="text-xs text-muted-foreground mb-1">Reward</p>
              <p className="font-display font-semibold text-success">{campaign.reward_amount} {rewardLabel[campaign.reward_type]}</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-xs text-muted-foreground mb-1">Deadline</p>
              <p className="font-display font-semibold">{campaign.deadline || "No deadline"}</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-xs text-muted-foreground mb-1">Requirements</p>
              <p className="text-sm">{campaign.requirements || "None specified"}</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-xs text-muted-foreground mb-1">Deliverables</p>
              <p className="text-sm">{campaign.deliverables || "None specified"}</p>
            </div>
          </div>

          {/* Apply section */}
          {campaign.status === "active" && !isCreator && !userApplied && (
            <div className="mt-6">
              {!showApplyForm ? (
                <button onClick={() => setShowApplyForm(true)} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                  Apply for Campaign
                </button>
              ) : (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 space-y-3">
                  <h3 className="font-display font-semibold">Your Application</h3>
                  <textarea
                    placeholder="Why are you a good fit? (experience, audience, etc.)"
                    value={applyMessage}
                    onChange={(e) => setApplyMessage(e.target.value)}
                    rows={3}
                    className="w-full bg-muted/30 rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                  />
                  <input
                    placeholder="Social links (Twitter, YouTube, etc.)"
                    value={applyLinks}
                    onChange={(e) => setApplyLinks(e.target.value)}
                    className="w-full bg-muted/30 rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleApply(campaign.id)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
                      <Send className="w-4 h-4" /> Submit Application
                    </button>
                    <button onClick={() => setShowApplyForm(false)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted/30">
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
          {userApplied && !isCreator && (
            <p className="mt-6 text-sm text-muted-foreground">✓ You've already applied to this campaign</p>
          )}

          {/* Creator: view applicants */}
          {isCreator && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold">Applicants ({apps.length})</h3>
                {campaign.status === "active" && (
                  <button onClick={() => handleClose(campaign.id)} className="text-xs px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                    Close Campaign
                  </button>
                )}
              </div>
              {apps.length === 0 ? (
                <p className="text-sm text-muted-foreground">No applications yet.</p>
              ) : (
                <div className="space-y-3">
                  {apps.map((app) => (
                    <div key={app.id} className="glass-card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{app.username}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusBadge[app.status]}`}>{app.status}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{app.message}</p>
                        {app.submission_links && (
                          <p className="text-xs text-primary mt-1 flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" /> {app.submission_links}
                          </p>
                        )}
                      </div>
                      {app.status === "pending" && (
                        <div className="flex gap-2">
                          <button onClick={() => handleAppStatus(app.id, "approved")} className="text-xs px-3 py-1.5 rounded-lg bg-success/10 text-success hover:bg-success/20">
                            Approve
                          </button>
                          <button onClick={() => handleAppStatus(app.id, "rejected")} className="text-xs px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20">
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // List view
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Collab Marketplace</h1>
          <p className="text-muted-foreground text-sm mt-1">Find campaigns or promote projects</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          + New Campaign
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">Create Campaign</h3>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input placeholder="Project name" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="w-full bg-muted/30 rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" />
            <input placeholder="Campaign title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-muted/30 rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="sm:col-span-2 w-full bg-muted/30 rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none" />
            <select value={rewardType} onChange={(e) => setRewardType(e.target.value as Campaign["reward_type"])} className="w-full bg-muted/30 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50">
              <option value="USDT">USDT</option>
              <option value="token">Token</option>
              <option value="fixed">Fixed Pay</option>
            </select>
            <input type="number" placeholder="Reward amount" value={rewardAmount} onChange={(e) => setRewardAmount(e.target.value)} className="w-full bg-muted/30 rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" />
            <input placeholder="Requirements (followers, niche, etc.)" value={requirements} onChange={(e) => setRequirements(e.target.value)} className="w-full bg-muted/30 rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" />
            <input placeholder="Deliverables (tweets, streams, referrals)" value={deliverables} onChange={(e) => setDeliverables(e.target.value)} className="w-full bg-muted/30 rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" />
            <input type="date" placeholder="Deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="sm:col-span-2 w-full bg-muted/30 rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" />
            <button onClick={handleCreate} disabled={!title || !projectName} className="sm:col-span-2 w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
              Create Campaign
            </button>
          </div>
        </motion.div>
      )}

      {campaigns.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No campaigns yet. Create the first one!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card-hover p-5 flex flex-col cursor-pointer"
              onClick={() => setSelectedCampaign(c.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-primary font-medium">{c.project_name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusBadge[c.status]}`}>{c.status}</span>
              </div>
              <h3 className="font-display font-semibold">{c.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 flex-1 line-clamp-2">{c.description}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-1 text-sm text-success font-medium">
                  <DollarSign className="w-4 h-4" /> {c.reward_amount} {rewardLabel[c.reward_type]}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="w-3.5 h-3.5" /> {getApplicationsByCampaign(c.id).length} applicants
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
