import { Route, Routes } from "react-router-dom";
import DashboardPage from "./components/DashboardPage";
import UsersPage from "./components/UsersPage";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/dashboard" element={<DashboardPage />} />
      <Route path="/admin/users" element={<UsersPage />} />
      {/* Add more routes for the Admin section */}
    </Routes>
  );
};

export default AdminRoutes;
