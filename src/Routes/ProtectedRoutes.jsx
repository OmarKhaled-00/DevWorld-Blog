import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
function ProtectedRoutes() {
  const { user, loading } = useAuth();

  if (loading) return null; // or loader
  console.log("pR: ", user);

  return user ? <Outlet /> : <Navigate to="/" replace />;
}

export default ProtectedRoutes;
