import { motion } from "framer-motion";
import { MessageSquare, CheckCircle2, Circle, Clock, Send, Paperclip } from "lucide-react";
import { useState } from "react";

const tasks = [
  { title: "Set up smart contract template", status: "done" },
  { title: "Design game UI mockups", status: "done" },
  { title: "Implement on-chain RNG", status: "progress" },
  { title: "Build frontend betting interface", status: "progress" },
  { title: "Integrate wallet connection", status: "todo" },
  { title: "Deploy to Base testnet", status: "todo" },
  { title: "Security audit", status: "todo" },
];

const messages = [
  { user: "Alice", text: "Smart contract template is ready for review", time: "10:30 AM" },
  { user: "Bob", text: "Great! I'll integrate the RNG module this afternoon", time: "10:45 AM" },
  { user: "Charlie", text: "UI mockups uploaded to the shared folder 🎨", time: "11:02 AM" },
  { user: "Alice", text: "Looking good! Let's discuss the betting logic in the call", time: "11:15 AM" },
];

const statusIcon = {
  done: <CheckCircle2 className="w-4 h-4 text-success" />,
  progress: <Clock className="w-4 h-4 text-warning" />,
  todo: <Circle className="w-4 h-4 text-muted-foreground" />,
};

export default function CollaborationPage() {
  const [msg, setMsg] = useState("");

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Collaboration</h1>
        <p className="text-muted-foreground text-sm mt-1">CryptoSlots — Project Workspace</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Chat */}
        <div className="lg:col-span-3 glass-card flex flex-col h-[600px]">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Discussion</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] text-primary-foreground font-bold">
                    {m.user[0]}
                  </div>
                  <span className="text-sm font-medium">{m.user}</span>
                  <span className="text-xs text-muted-foreground">{m.time}</span>
                </div>
                <p className="text-sm text-muted-foreground ml-8">{m.text}</p>
              </motion.div>
            ))}
          </div>
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <button className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground transition-colors">
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-muted/30 rounded-lg px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <button className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Task Board */}
        <div className="lg:col-span-2 glass-card p-5">
          <h2 className="font-display font-semibold mb-4">Task Board</h2>
          <div className="space-y-2">
            {tasks.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                {statusIcon[t.status as keyof typeof statusIcon]}
                <span className={`text-sm ${t.status === "done" ? "line-through text-muted-foreground" : ""}`}>{t.title}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
