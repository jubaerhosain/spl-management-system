import { Outlet } from "react-router-dom";
import Sidebar from "@components/sidebar/Sidebar";

export default function AdminLayout() {
  return (
    <div className="relative overflow-hidden flex flex-grow flex-row">
      <div className="flex flex-col overflow-y-auto fixed h-screen">
        <Sidebar />
      </div>
      <Outlet />
    </div>
  );
}
