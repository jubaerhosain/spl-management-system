import { Navigate, Outlet } from "react-router-dom";
import { useAuthProvider } from "@contexts/AuthProvider";

export default function PrivateOutlet() {
  const { loggedIn } = useAuthProvider();

  return loggedIn ? <Outlet /> : <Navigate to="/login" />;
}
