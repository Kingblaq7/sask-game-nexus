import { create } from "zustand";

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "application" | "status" | "info";
  read: boolean;
  link?: string;
  created_at: string;
}

const NOTIFS_KEY = "w3gh:notifications";

function readNotifs(): AppNotification[] {
  try {
    return JSON.parse(localStorage.getItem(NOTIFS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeNotifs(n: AppNotification[]) {
  localStorage.setItem(NOTIFS_KEY, JSON.stringify(n));
}

export function addNotification(n: Omit<AppNotification, "id" | "read" | "created_at">) {
  const all = readNotifs();
  const notif: AppNotification = {
    ...n,
    id: crypto.randomUUID(),
    read: false,
    created_at: new Date().toISOString(),
  };
  writeNotifs([notif, ...all]);
  // trigger store refresh
  useNotificationStore.getState().refresh();
}

export function getUserNotifications(userId: string): AppNotification[] {
  return readNotifs().filter((n) => n.user_id === userId);
}

export function markRead(id: string) {
  const all = readNotifs();
  const idx = all.findIndex((n) => n.id === id);
  if (idx !== -1) {
    all[idx].read = true;
    writeNotifs(all);
  }
}

export function markAllRead(userId: string) {
  const all = readNotifs();
  all.forEach((n) => {
    if (n.user_id === userId) n.read = true;
  });
  writeNotifs(all);
}

interface NotificationState {
  tick: number;
  refresh: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  tick: 0,
  refresh: () => set((s) => ({ tick: s.tick + 1 })),
}));
