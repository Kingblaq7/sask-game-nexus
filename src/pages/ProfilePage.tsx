import { motion } from "framer-motion";
import {
  User, Wallet, Twitter, Send, Youtube, Globe, Copy, CheckCircle2,
  Megaphone, DollarSign, TrendingUp, Award, ExternalLink, Edit2, Save, X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/hooks/useWallet";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  getCampaigns,
  getApplicationsByUser,
  getUserEarnings,
  getUserReferral,
} from "@/lib/localStore";

const SOCIAL_KEY = "w3gh:socials";

interface SocialLinks {
  twitter: string;
  telegram: string;
  youtube: string;
  website: string;
}

function readSocials(userId: string): SocialLinks {
  try {
    const all = JSON.parse(localStorage.getItem(SOCIAL_KEY) || "{}");
    return all[userId] || { twitter: "", telegram: "", youtube: "", website: "" };
  } catch {
    return { twitter: "", telegram: "", youtube: "", website: "" };
  }
}

function writeSocials(userId: string, socials: SocialLinks) {
  const all = JSON.parse(localStorage.getItem(SOCIAL_KEY) || "{}");
  all[userId] = socials;
  localStorage.setItem(SOCIAL_KEY, JSON.stringify(all));
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { address } = useWallet();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [socials, setSocials] = useState<SocialLinks>(() => readSocials(user?.email || ""));
  const [editSocials, setEditSocials] = useState<SocialLinks>(socials);

  const stats = useMemo(() => {
    if (!user) return { campaigns: 0, applications: 0, approved: 0, totalEarned: 0, referralClicks: 0, referralSignups: 0 };
    const apps = getApplicationsByUser(user.email);
    const earnings = getUserEarnings(user.email);
    const campaigns = getCampaigns().filter((c) => c.creator === user.email);
    const referral = getUserReferral(user.email);
    return {
      campaigns: campaigns.length,
      applications: apps.length,
      approved: apps.filter((a) => a.status === "approved").length,
      totalEarned: earnings.reduce((s, e) => s + e.amount, 0),
      referralClicks: referral.clicks,
      referralSignups: referral.signups,
    };
  }, [user]);

  const pastCollabs = useMemo(() => {
    if (!user) return [];
    const apps = getApplicationsByUser(user.email).filter((a) => a.status === "approved");
    return apps.map((app) => {
      const campaigns = getCampaigns();
      const campaign = campaigns.find((c) => c.id === app.campaign_id);
      return { ...app, campaign };
    });
  }, [user]);

  const handleSave = () => {
    if (!user) return;
    writeSocials(user.email, editSocials);
    setSocials(editSocials);
    setEditing(false);
    toast({ title: "Profile updated!" });
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({ title: "Wallet address copied!" });
    }
  };

  if (!user) return null;

  const statCards = [
    { label: "Campaigns Created", value: stats.campaigns, icon: Megaphone },
    { label: "Applications", value: stats.applications, icon: Send },
    { label: "Approved Collabs", value: stats.approved, icon: Award },
    { label: "Total Earned", value: `$${stats.totalEarned}`, icon: DollarSign },
    { label: "Referral Clicks", value: stats.referralClicks, icon: TrendingUp },
    { label: "Referral Signups", value: stats.referralSignups, icon: CheckCircle2 },
  ];

  const socialFields: { key: keyof SocialLinks; icon: typeof Twitter; label: string; prefix: string }[] = [
    { key: "twitter", icon: Twitter, label: "Twitter / X", prefix: "https://x.com/" },
    { key: "telegram", icon: Send, label: "Telegram", prefix: "https://t.me/" },
    { key: "youtube", icon: Youtube, label: "YouTube", prefix: "https://youtube.com/" },
    { key: "website", icon: Globe, label: "Website", prefix: "" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl font-bold">{user.username}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
            {address ? (
              <button onClick={copyAddress} className="flex items-center gap-2 mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors group">
                <Wallet className="w-3.5 h-3.5 text-primary" />
                <span className="font-mono">{address.slice(0, 6)}...{address.slice(-4)}</span>
                <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ) : (
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5" /> No wallet connected
              </p>
            )}
          </div>
          <button
            onClick={() => { setEditing(!editing); setEditSocials(socials); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:bg-muted/30 transition-colors"
          >
            {editing ? <><X className="w-3.5 h-3.5" /> Cancel</> : <><Edit2 className="w-3.5 h-3.5" /> Edit Profile</>}
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <s.icon className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="text-xl font-display font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Social Links */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold">Social Links</h2>
          {editing && (
            <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90">
              <Save className="w-3.5 h-3.5" /> Save
            </button>
          )}
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {socialFields.map((field) => (
            <div key={field.key} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                <field.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              {editing ? (
                <input
                  value={editSocials[field.key]}
                  onChange={(e) => setEditSocials({ ...editSocials, [field.key]: e.target.value })}
                  placeholder={field.label}
                  className="flex-1 bg-muted/30 rounded-lg px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              ) : socials[field.key] ? (
                <a
                  href={field.prefix + socials[field.key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  {socials[field.key]} <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-sm text-muted-foreground">Not set</span>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Past Collaborations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
        <h2 className="font-display font-semibold mb-4">Past Collaborations</h2>
        {pastCollabs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No completed collaborations yet.</p>
        ) : (
          <div className="space-y-3">
            {pastCollabs.map((collab) => (
              <div key={collab.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/20 border border-border/50">
                <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{collab.campaign?.title || "Unknown Campaign"}</p>
                  <p className="text-xs text-muted-foreground">{collab.campaign?.project_name}</p>
                </div>
                {collab.campaign && (
                  <span className="text-xs font-medium text-success">
                    ${collab.campaign.reward_amount}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
