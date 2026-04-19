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
  X,
} from "lucide-react";
import { WalletButton } from "@/components/WalletButton";
import { NotificationBell } from "@/components/NotificationBell";
import { NavLink } from "@/components/NavLink";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
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

interface AppSidebarProps {
  onClose?: () => void;
  isMobileOverlay?: boolean;
}

export function AppSidebar({ onClose, isMobileOverlay }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, signOut } = useAuth();
  const { role } = useUserRole();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleNavClick = () => {
    if (isMobileOverlay && onClose) {
      onClose();
    }
  };

  // On mobile overlay, never collapse — always show full sidebar
  const isCollapsed = isMobileOverlay ? false : collapsed;

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen sticky top-0 flex flex-col bg-sidebar border-r border-border"
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
        <img src={logo} alt="Sask Gaming Pad" className="w-8 h-8 rounded-lg object-contain flex-shrink-0" />
        {!isCollapsed && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display font-bold text-sm truncate flex-1">
            Sask Gaming Pad
          </motion.span>
        )}
        {isMobileOverlay && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground transition-colors ml-auto"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
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
            onClick={handleNavClick}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-border space-y-2">
        <div className="flex items-center gap-1">
          <div className="flex-1">
            <WalletButton collapsed={isCollapsed} />
          </div>
          <NotificationBell collapsed={isCollapsed} />
        </div>
        {!isCollapsed && user && (
          <div className="glass-card p-3">
            <div className="flex items-center gap-2 text-xs">
              <User className="w-4 h-4 text-primary" />
              <span className="truncate font-medium">{(user.user_metadata as any)?.username || user.email}</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground capitalize">{role || "member"}</div>
          </div>
        )}
        <div className="flex gap-1">
          {!isCollapsed && (
            <button
              onClick={handleSignOut}
              className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          )}
          {!isMobileOverlay && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex items-center justify-center p-2 rounded-lg hover:bg-muted/50 text-muted-foreground transition-colors"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
