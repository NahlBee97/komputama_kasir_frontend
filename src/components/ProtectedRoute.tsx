import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = () => {
  const { user } = useAuth();

const isAdminRoute = useLocation().pathname.startsWith("/admin");

  if (user) {
    if (user.role !== "ADMIN" && isAdminRoute) {
      return <Navigate to="/pos" replace />;
    } else {
      return <Outlet />;
    }
  } else {
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
