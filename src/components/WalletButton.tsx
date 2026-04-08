import { Wallet, ChevronDown, ExternalLink, Unplug } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function WalletButton({ collapsed = false }: { collapsed?: boolean }) {
  const { address, shortAddress, isBaseNetwork, connecting, error, hasProvider, connect, disconnect, switchToBase } = useWallet();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) toast({ title: "Wallet Error", description: error, variant: "destructive" });
  }, [error, toast]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!address) {
    return (
      <button
        onClick={connect}
        disabled={connecting}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium w-full justify-center disabled:opacity-50"
      >
        <Wallet className="w-4 h-4 flex-shrink-0" />
        {!collapsed && (connecting ? "Connecting..." : "Connect Wallet")}
      </button>
    );
  }

  if (collapsed) {
    return (
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center p-2 rounded-lg bg-success/10 text-success"
        title={shortAddress || ""}
      >
        <Wallet className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors text-sm font-medium w-full"
      >
        <Wallet className="w-4 h-4 flex-shrink-0" />
        <span className="truncate">{shortAddress}</span>
        <ChevronDown className={`w-3 h-3 ml-auto transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-full glass-card p-2 space-y-1 z-50">
          {!isBaseNetwork && (
            <button
              onClick={() => { switchToBase(); setOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-warning hover:bg-warning/10 transition-colors"
            >
              <ExternalLink className="w-3 h-3" /> Switch to Base
            </button>
          )}
          <button
            onClick={() => {
              navigator.clipboard.writeText(address);
              toast({ title: "Address copied!" });
              setOpen(false);
            }}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-muted-foreground hover:bg-muted/50 transition-colors"
          >
            <Wallet className="w-3 h-3" /> Copy Address
          </button>
          <button
            onClick={() => { disconnect(); setOpen(false); }}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Unplug className="w-3 h-3" /> Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
