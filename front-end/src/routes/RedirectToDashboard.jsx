import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthProvider } from "@contexts/AuthProvider";

export default function RedirectToDashboard() {
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
        navigate("/login");
    }
  }, [user, navigate]);

  return null;
}
