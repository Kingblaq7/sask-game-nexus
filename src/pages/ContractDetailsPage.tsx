import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileCode2, Copy, BookOpen, Send, ExternalLink, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getContractById, type Contract } from "@/lib/localStore";
import { toast } from "@/hooks/use-toast";

const statusConfig: Record<Contract["status"], { icon: typeof CheckCircle2; label: string; class: string }> = {
  active: { icon: CheckCircle2, label: "Active", class: "bg-success/10 text-success" },
  pending: { icon: Clock, label: "Pending", class: "bg-warning/10 text-warning" },
};

export default function ContractDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const contract = id ? getContractById(id) : undefined;
  const [reading, setReading] = useState(false);
  const [sending, setSending] = useState(false);
  const [readResult, setReadResult] = useState<string | null>(null);

  if (!contract) {
    return (
      <div className="p-6 lg:p-8">
        <div className="glass-card p-12 text-center">
          <h2 className="font-display text-xl font-bold">Contract not found</h2>
          <Link to="/contracts" className="text-primary text-sm mt-3 inline-block">← Back to Contracts</Link>
        </div>
      </div>
    );
  }

  const sc = statusConfig[contract.status];

  const copyAddr = () => {
    navigator.clipboard.writeText(contract.address);
    toast({ title: "Address copied" });
  };

  // Future: replace with ethers.js read call against Base RPC
  const handleRead = async () => {
    setReading(true);
    setReadResult(null);
    await new Promise((r) => setTimeout(r, 800));
    setReadResult(`balance: ${(Math.random() * 10).toFixed(4)} ETH | totalPlays: ${Math.floor(Math.random() * 1000)}`);
    setReading(false);
  };

  // Future: replace with ethers.js signer.sendTransaction()
  const handleSend = async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    toast({
      title: "Transaction sent (simulated)",
      description: `tx: 0x${Math.random().toString(16).slice(2, 10)}...`,
    });
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-4xl">
      <Link to="/contracts" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to Contracts
      </Link>

      <div className="glass-card p-6">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileCode2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">{contract.name}</h1>
              <p className="text-sm text-muted-foreground">{contract.type}</p>
            </div>
          </div>
          <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${sc.class}`}>
            <sc.icon className="w-3 h-3" /> {sc.label}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Contract Address</div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-primary break-all">{contract.address}</span>
              <button onClick={copyAddr} className="text-muted-foreground hover:text-foreground flex-shrink-0">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Creator</div>
            <div className="text-sm truncate">{contract.creator}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Network</div>
            <div className="text-sm">Base Mainnet</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Deployed</div>
            <div className="text-sm">{new Date(contract.created_at).toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="font-display font-semibold mb-4">Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleRead} disabled={reading} variant="outline">
            <BookOpen className="w-4 h-4 mr-1" />
            {reading ? "Reading..." : "Read Contract"}
          </Button>
          <Button onClick={handleSend} disabled={sending}>
            <Send className="w-4 h-4 mr-1" />
            {sending ? "Sending..." : "Send Transaction"}
          </Button>
          <a
            href={`https://basescan.org/address/${contract.address}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted/50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> View on BaseScan
          </a>
        </div>

        {readResult && (
          <div className="mt-4 p-3 rounded-lg bg-muted/30 font-mono text-xs">
            {readResult}
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-4">
          Interactions are simulated. Connect a wallet and integrate ethers.js to enable live calls on Base.
        </p>
      </div>
    </div>
  );
}
