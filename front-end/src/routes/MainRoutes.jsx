import { Route, Routes } from "react-router-dom";
import MainLayout from "../pages/MainPanel/layouts/MainLayout";
import PublicRoute from "./protected-route-layouts/PublicRoute";
// import PrivateRoute from "./protected-route-layouts/PrivateRoute";
import AdminRoutes from "./AdminRoutes";
import TeacherRoutes from "./TeacherRoutes";
import StudentRoutes from "./StudentRoutes";

export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<h1>home</h1>} />
        <Route path="about" element={<h1>about</h1>} />
        <Route path="faculty" element={<h1>faculty</h1>} />
        <Route path="notices" element={<h1>Notices</h1>} />
        <Route path="projects" element={<h1>Notices</h1>} />

        <Route path="/*" element={<PublicRoute />}>
          <Route path="login" element={<h1>Login page</h1>} />
          <Route path="forgot-password" element={<h1>Forgot password</h1>} />
          <Route path="verify-otp" element={<h1>Verify otp</h1>} />
          <Route path="reset-password" element={<h1>Rest password</h1>} />
        </Route>

        <Route path="/admin/*" element={<AdminRoutes />}></Route>
        <Route path="/teacher/*" element={<TeacherRoutes />}></Route>
        <Route path="/student/*" element={<StudentRoutes />}></Route>
      </Route>
    </Routes>
  );
}
