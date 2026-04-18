import { useState } from "react";
import { motion } from "framer-motion";
import { FileCode2, Rocket, CheckCircle2, Clock, ExternalLink, Plus, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { deployContract, getContracts, type Contract } from "@/lib/localStore";
import { toast } from "@/hooks/use-toast";

const shortAddr = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`;

const statusConfig: Record<Contract["status"], { icon: typeof CheckCircle2; label: string; class: string }> = {
  active: { icon: CheckCircle2, label: "Active", class: "bg-success/10 text-success" },
  pending: { icon: Clock, label: "Pending", class: "bg-warning/10 text-warning" },
};

export default function ContractsPage() {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>(getContracts());
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<Contract["type"]>("Casino Game");

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    const c = deployContract({ name: name.trim(), type, creator: user.email });
    setContracts(getContracts());
    setName("");
    setType("Casino Game");
    setOpen(false);
    toast({ title: "Contract deployed", description: shortAddr(c.address) });
  };

  const copyAddr = (e: React.MouseEvent, addr: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(addr);
    toast({ title: "Address copied" });
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Smart Contracts</h1>
          <p className="text-muted-foreground text-sm mt-1">Deploy and manage game contracts on Base</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-1" /> Deploy Contract
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Deploy New Contract</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleDeploy} className="space-y-4">
              <div>
                <Label htmlFor="name">Contract Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="My Slot Machine" />
              </div>
              <div>
                <Label htmlFor="type">Contract Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as Contract["type"])}>
                  <SelectTrigger id="type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Casino Game">Casino Game</SelectItem>
                    <SelectItem value="Betting Pool">Betting Pool</SelectItem>
                    <SelectItem value="NFT Asset">NFT Asset</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                <Rocket className="w-4 h-4 mr-1" /> Deploy
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {contracts.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FileCode2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-display font-semibold">No contracts yet</h3>
          <p className="text-sm text-muted-foreground mt-1">Deploy your first contract to get started</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contracts.map((c, i) => {
            const sc = statusConfig[c.status];
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/contracts/${c.id}`} className="block glass-card-hover p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileCode2 className="w-5 h-5 text-primary" />
                    </div>
                    <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${sc.class}`}>
                      <sc.icon className="w-3 h-3" /> {sc.label}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold truncate">{c.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{c.type}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-primary">
                    <span className="font-mono">{shortAddr(c.address)}</span>
                    <button onClick={(e) => copyAddr(e, c.address)} className="hover:text-primary/80">
                      <Copy className="w-3 h-3" />
                    </button>
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
