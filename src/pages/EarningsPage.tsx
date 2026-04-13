import { motion } from "framer-motion";
import { DollarSign, MousePointerClick, UserPlus, Wallet, Copy, Check, ArrowDownToLine, Clock, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  getUserReferral,
  getUserEarnings,
  getUserWithdrawals,
  requestWithdrawal,
  type Earning,
  type Withdrawal,
} from "@/lib/localStore";
import { useWallet } from "@/hooks/useWallet";

const statusBadge: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  approved: "bg-primary/10 text-primary",
  paid: "bg-success/10 text-success",
  completed: "bg-success/10 text-success",
};

export default function EarningsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { address } = useWallet();
  const [copied, setCopied] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawWallet, setWithdrawWallet] = useState(address || "");
  const [, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  const referral = useMemo(() => {
    if (!user) return null;
    return getUserReferral(user.email);
  }, [user]);

  const earnings = useMemo(() => {
    if (!user) return [];
    return getUserEarnings(user.email);
  }, [user]);

  const withdrawals = useMemo(() => {
    if (!user) return [];
    return getUserWithdrawals(user.email);
  }, [user]);

  const totalEarnings = earnings.reduce((s, e) => s + e.amount, 0);
  const approvedEarnings = earnings.filter((e) => e.status === "approved" || e.status === "paid").reduce((s, e) => s + e.amount, 0);
  const pendingEarnings = earnings.filter((e) => e.status === "pending").reduce((s, e) => s + e.amount, 0);
  const paidEarnings = earnings.filter((e) => e.status === "paid").reduce((s, e) => s + e.amount, 0);
  const withdrawnAmount = withdrawals.filter((w) => w.status === "completed").reduce((s, w) => s + w.amount, 0);
  const pendingWithdrawals = withdrawals.filter((w) => w.status === "pending").reduce((s, w) => s + w.amount, 0);
  const availableBalance = approvedEarnings - withdrawnAmount - pendingWithdrawals;

  const referralLink = referral ? `${window.location.origin}/?ref=${referral.referral_code}` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Referral link copied!" });
  };

  const handleWithdraw = () => {
    if (!user || !withdrawWallet) return;
    try {
      requestWithdrawal({
        user_id: user.email,
        amount: parseFloat(withdrawAmount) || 0,
        wallet_address: withdrawWallet,
      });
      setWithdrawAmount("");
      refresh();
      toast({ title: "Withdrawal requested!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const statCards = [
    { label: "Total Earnings", value: `$${totalEarnings.toFixed(2)}`, icon: DollarSign, color: "text-success" },
    { label: "Pending", value: `$${pendingEarnings.toFixed(2)}`, icon: Clock, color: "text-warning" },
    { label: "Clicks", value: referral?.clicks || 0, icon: MousePointerClick, color: "text-primary" },
    { label: "Signups", value: referral?.signups || 0, icon: UserPlus, color: "text-accent" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Earnings Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Track your affiliate performance and withdraw earnings</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className="font-display text-xl font-bold">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Referral Section */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
        <h2 className="font-display font-semibold mb-3">Your Referral Link</h2>
        <div className="flex gap-2">
          <div className="flex-1 bg-muted/30 rounded-lg px-4 py-2.5 text-sm text-muted-foreground truncate">
            {referralLink}
          </div>
          <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Share this link to earn rewards from signups and referrals.</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Earnings Table */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
          <h2 className="font-display font-semibold mb-4">Earnings History</h2>
          {earnings.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No earnings yet. Apply for campaigns to start earning!</p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {earnings.map((e) => (
                <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div>
                    <p className="text-sm font-medium">{e.campaign_title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-success">${e.amount.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusBadge[e.status]}`}>{e.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Withdraw Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
          <h2 className="font-display font-semibold mb-4">Withdraw</h2>

          <div className="glass-card p-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Available Balance</span>
              <span className="font-display text-lg font-bold text-success">${availableBalance.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Wallet address (0x...)"
              value={withdrawWallet}
              onChange={(e) => setWithdrawWallet(e.target.value)}
              className="w-full bg-muted/30 rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
            <input
              type="number"
              placeholder="Amount (USDT)"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="w-full bg-muted/30 rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
            <button
              onClick={handleWithdraw}
              disabled={!withdrawWallet || !withdrawAmount || availableBalance <= 0}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <ArrowDownToLine className="w-4 h-4" /> Request Withdrawal
            </button>
          </div>

          {/* Withdrawal History */}
          {withdrawals.length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Withdrawal History</h3>
              {withdrawals.map((w) => (
                <div key={w.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div>
                    <p className="text-sm font-medium">${w.amount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">{w.wallet_address}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusBadge[w.status]}`}>{w.status}</span>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(w.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
