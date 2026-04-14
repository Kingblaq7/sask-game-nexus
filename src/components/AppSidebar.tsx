import logo from "@/assets/logo.png";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Vote,
  PieChart,
  FileCode2,
  BarChart3,
  Megaphone,
  DollarSign,
  
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react";
import { WalletButton } from "@/components/WalletButton";
import { NotificationBell } from "@/components/NotificationBell";
import { NavLink } from "@/components/NavLink";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Projects", url: "/projects", icon: FolderKanban },
  { title: "Collaboration", url: "/collaboration", icon: Users },
  { title: "DAO Voting", url: "/dao", icon: Vote },
  { title: "Revenue Splits", url: "/revenue", icon: PieChart },
  { title: "Smart Contracts", url: "/contracts", icon: FileCode2 },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Collabs", url: "/collabs", icon: Megaphone },
  { title: "Earnings", url: "/earnings", icon: DollarSign },
  { title: "Profile", url: "/profile", icon: User },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen sticky top-0 flex flex-col bg-sidebar border-r border-border"
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
        <img src={logo} alt="Sask Gaming Pad" className="w-8 h-8 rounded-lg object-contain flex-shrink-0" />
        {!collapsed && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display font-bold text-sm truncate">
            Sask Gaming Pad
          </motion.span>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors text-sm"
            activeClassName="bg-primary/10 text-primary border border-primary/20"
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-border space-y-2">
        <div className="flex items-center gap-1">
          <div className="flex-1">
            <WalletButton collapsed={collapsed} />
          </div>
          <NotificationBell collapsed={collapsed} />
        </div>
        {!collapsed && user && (
          <div className="glass-card p-3">
            <div className="flex items-center gap-2 text-xs">
              <User className="w-4 h-4 text-primary" />
              <span className="truncate font-medium">{user.username || user.email}</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground capitalize">member</div>
          </div>
        )}
        <div className="flex gap-1">
          {!collapsed && (
            <button
              onClick={handleSignOut}
              className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center p-2 rounded-lg hover:bg-muted/50 text-muted-foreground transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
