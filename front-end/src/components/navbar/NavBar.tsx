"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import PublicNavBar from "./PublicNavBar";
import StudentNavBar from "./StudentNavBar";
import TeacherNavBar from "./TeacherNavBar";
import AdminNavBar from "./AdminNavBar";

const NavBar = () => {
  const { user, isLoading } = useAuthContext();

  if (isLoading) return <h1>Loading...</h1>;

  if (!user) {
    return <PublicNavBar />;
  } else if (user?.userType === "student") {
    return <StudentNavBar />;
  } else if (user?.userType === "teacher") {
    return <TeacherNavBar />;
  } else if (user?.userType === "admin") {
    return <AdminNavBar />;
  }

  return null;
};

export default NavBar;
