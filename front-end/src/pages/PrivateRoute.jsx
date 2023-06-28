import { Navigate, Outlet } from "react-router-dom";
import { useAuthProvider } from "@contexts/AuthProvider";

export default function PrivateLayout() {
  const { loading, user } = useAuthProvider();

  if (loading) {
    return <h1>Loading....</h1>;
  }

  console.log("user", user);

  return user ? <Outlet /> : <Navigate to="/login" />;
}
