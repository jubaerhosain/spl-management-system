import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./protected-route-layouts/PrivateRoute";
import AdminLayout from "../pages/AdminPanel/layouts/AdminLayout";
import AdminDashboard from "@pages/AdminPanel/dashboard/AdminDashboard";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route path="/*" element={<PrivateRoute />}>
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<h1>admin profile</h1>} />
          <Route path="spl" element={<h1>spl</h1>} />
          <Route path="settings" element={<h1>admin marking</h1>} />
          <Route path="a/b"></Route>
        </Route>
      </Route>
    </Routes>
  );
}
