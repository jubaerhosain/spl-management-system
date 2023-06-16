import { Outlet } from "react-router-dom";
import { useAuthProvider } from "@contexts/AuthProvider";
import RedirectToDashboard from "./RedirectToDashboard";

export default function PublicOutlet() {
  const { user, loading } = useAuthProvider();

  if (loading) {
    return <h1>Loading....</h1>;
  }

  return !user ? <Outlet /> : <RedirectToDashboard />;
}
