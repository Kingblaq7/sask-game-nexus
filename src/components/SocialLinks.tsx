import { MessageCircle, Send, Twitter } from "lucide-react";

const socials = [
  { name: "Discord", url: "https://discord.gg/6yvQjghuCz", icon: MessageCircle, label: "Join Discord" },
  { name: "Telegram", url: "https://t.me/squad_gamers", icon: Send, label: "Join Telegram" },
  { name: "X (Twitter)", url: "https://x.com/Saskgamers", icon: Twitter, label: "Follow on X" },
];

export function SocialLinks({ variant = "icons" }: { variant?: "icons" | "buttons" }) {
  if (variant === "buttons") {
    return (
      <div className="flex flex-wrap gap-3">
        {socials.map((s) => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card-hover flex items-center gap-2 px-4 py-2.5 text-sm font-medium hover:text-primary transition-colors"
          >
            <s.icon className="w-4 h-4" />
            {s.label}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {socials.map((s) => (
        <a
          key={s.name}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <s.icon className="w-5 h-5" />
        </a>
      ))}
    </div>
  );
}
