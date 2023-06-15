import { Outlet } from "react-router-dom";
import { useAuthProvider } from "@contexts/AuthProvider";
import RedirectToDashboard from "./RedirectToDashboard";

export default function PublicOutlet() {
  const { loggedIn } = useAuthProvider();

  return !loggedIn ? <Outlet /> : <RedirectToDashboard />;
}
