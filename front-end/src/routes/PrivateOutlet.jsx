import { Navigate, Outlet } from "react-router-dom";
import { useAuthProvider } from "@contexts/AuthProvider";

export default function PrivateOutlet() {
  const { user } = useAuthProvider();

  return user ? <Outlet /> : <Navigate to="/login" />;
}
