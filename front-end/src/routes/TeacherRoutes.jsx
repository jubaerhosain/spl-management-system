import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./protected-route-layouts/PrivateRoute";
import TeacherLayout from "../pages/TeacherPanel/layouts/TeacherLayout";

export default function TeacherRoutes() {
  return (
    <Routes>
      <Route path="/" element={<TeacherLayout />}>
        <Route path="/*" element={<PrivateRoute />}>
          <Route index element={<h1>admin</h1>} />
          <Route path="profile" element={<h1>admin profile</h1>} />
          <Route path="spl" element={<h1>spl</h1>} />
          <Route path="settings" element={<h1>admin marking</h1>} />
          <Route path="a/b"></Route>
        </Route>
      </Route>
    </Routes>
  );
}
