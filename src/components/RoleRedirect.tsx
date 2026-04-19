import { Navigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";

/** Routes /dashboard to the right role-specific page. */
export function RoleRedirect() {
  const { role, isLoading } = useUserRole();

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (role === "creator") return <Navigate to="/dashboard/creator" replace />;
  if (role === "builder") return <Navigate to="/dashboard/builder" replace />;
  return <Navigate to="/dashboard/general" replace />;
}
