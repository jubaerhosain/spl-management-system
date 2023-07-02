import { Outlet } from "react-router-dom";
import { useAuthProvider } from "@contexts/AuthProvider";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RedirectToDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthProvider();

  useEffect(() => {
    switch (user.userType) {
      case "admin":
        navigate("/admin");
        break;
      case "student":
        navigate("/student");
        break;
      case "teacher":
        navigate("/teacher");
        break;
      default:
        navigate("/");
    }
  }, [user, navigate]);

  return null;
}

export default function PublicLayout() {
  const { loading, user } = useAuthProvider();

  if (loading) {
    return <h1>Loading....</h1>;
  }

  return !user ? <Outlet /> : <RedirectToDashboard />;
}
