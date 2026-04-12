import { SocialLinks } from "./SocialLinks";
import { Gamepad2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border py-8 mt-auto">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-primary" />
          <span className="font-display font-semibold text-sm">Sask Gaming Pad</span>
        </div>
        <SocialLinks variant="icons" />
        <p className="text-xs text-muted-foreground">© 2026 Web3 Gaming Collaboration Hub</p>
      </div>
    </footer>
  );
}
