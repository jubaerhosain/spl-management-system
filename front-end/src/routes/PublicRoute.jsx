import { Navigate } from "react-router-dom";
import { useAuthProvider } from "@contexts/AuthProvider";

export default function PublicRoute({ children }) {
  const { loggedIn, loading } = useAuthProvider();

  return !loggedIn ? { children } : <Navigate to="/dashboard" />;
}
