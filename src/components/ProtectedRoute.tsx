import { Navigate, Outlet } from "react-router";
import { getToken } from "@/lib/auth";

function ProtectedRoute() {
  const token = getToken();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
