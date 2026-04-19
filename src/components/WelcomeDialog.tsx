import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Rocket } from "lucide-react";

interface WelcomeDialogProps {
  open: boolean;
  onClose: () => void;
  name: string;
  email: string;
}

export function WelcomeDialog({ open, onClose, name, email }: WelcomeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-2">
            <Rocket className="w-6 h-6 text-primary-foreground" />
          </div>
          <DialogTitle className="font-display text-2xl">Welcome to Sask Gaming Pad! 🚀</DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-xs">
            <Mail className="w-3.5 h-3.5" />
            A welcome email was sent to <span className="font-medium text-foreground">{email}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3 text-sm max-h-[50vh] overflow-y-auto">
          <p className="font-semibold text-foreground">Subject: Welcome to Sask Gaming Pad 🚀</p>
          <div className="space-y-2 text-muted-foreground leading-relaxed">
            <p>Hello {name || "there"},</p>
            <p>Welcome to Sask Gaming Pad — the future of Web3 gaming collaboration.</p>
            <p>You can now:</p>
            <ul className="list-disc pl-5 space-y-0.5">
              <li>Build and launch gaming projects</li>
              <li>Collaborate with developers and creators</li>
              <li>Participate in DAO governance</li>
              <li>Earn from Web3 gaming</li>
            </ul>
            <p>Your journey starts now. 👉 Start exploring your dashboard and connect with the community.</p>
            <p className="font-medium text-foreground">Join our community:</p>
            <ul className="list-none space-y-0.5 text-xs">
              <li>Discord: <a className="text-primary hover:underline" href="https://discord.gg/6yvQjghuCz" target="_blank" rel="noreferrer">discord.gg/6yvQjghuCz</a></li>
              <li>Telegram: <a className="text-primary hover:underline" href="https://t.me/squad_gamers" target="_blank" rel="noreferrer">t.me/squad_gamers</a></li>
              <li>Twitter: <a className="text-primary hover:underline" href="https://x.com/Saskgamers" target="_blank" rel="noreferrer">x.com/Saskgamers</a></li>
            </ul>
            <p className="pt-1">— Sask Gaming Pad Team</p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full">Enter your dashboard</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
