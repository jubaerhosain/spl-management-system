import { Outlet } from "react-router-dom";
import { useAuthProvider } from "@contexts/AuthProvider";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RedirectToProfile() {
  const navigate = useNavigate();
  const { user } = useAuthProvider();

  useEffect(() => {
    switch (user.userType) {
      case "admin":
        navigate("/admin/profile");
        break;
      case "student":
        navigate("/student/profile");
        break;
      case "teacher":
        navigate("/teacher/profile");
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

  console.log("user", user);

  return !user ? <Outlet /> : <RedirectToProfile />;
}
