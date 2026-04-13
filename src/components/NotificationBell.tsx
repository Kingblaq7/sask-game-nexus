import { useState, useRef, useEffect, useMemo } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  getUserNotifications,
  markRead,
  markAllRead,
  useNotificationStore,
  type AppNotification,
} from "@/lib/notifications";
import { useNavigate } from "react-router-dom";

const typeIcon: Record<string, string> = {
  application: "📩",
  status: "✅",
  info: "ℹ️",
};

export function NotificationBell({ collapsed }: { collapsed?: boolean }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const tick = useNotificationStore((s) => s.tick);

  const notifications = useMemo(() => {
    if (!user) return [];
    return getUserNotifications(user.email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, tick]);

  const unread = notifications.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClick = (n: AppNotification) => {
    markRead(n.id);
    useNotificationStore.getState().refresh();
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  const handleMarkAll = () => {
    if (!user) return;
    markAllRead(user.email);
    useNotificationStore.getState().refresh();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2 right-0 w-72 max-h-80 overflow-y-auto glass-card border border-border rounded-xl shadow-xl z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="font-display font-semibold text-sm">Notifications</span>
              {unread > 0 && (
                <button onClick={handleMarkAll} className="text-xs text-primary hover:underline">
                  Mark all read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">No notifications</div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.slice(0, 20).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleClick(n)}
                    className={`w-full text-left px-4 py-3 hover:bg-muted/30 transition-colors ${!n.read ? "bg-primary/5" : ""}`}
                  >
                    <div className="flex gap-2">
                      <span className="text-base mt-0.5">{typeIcon[n.type] || "📌"}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!n.read ? "font-medium" : "text-muted-foreground"}`}>{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          {new Date(n.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
