import { Outlet } from "react-router-dom";
import { useAuthProvider } from "@contexts/AuthProvider";
import RedirectToDashboard from "./RedirectToDashboard";

export default function PublicOutlet() {
  const { user } = useAuthProvider();

  return !user ? <Outlet /> : <RedirectToDashboard />;
}
