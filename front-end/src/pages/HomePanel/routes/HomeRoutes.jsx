import { Route, Routes } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";
import PublicRoute from "../../PublicRoute";
import PrivateRoute from "../../PrivateRoute";

export default function HomeRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<h1>home</h1>} />
        <Route path="about" element={<h1>about</h1>} />
        <Route path="faculty" element={<h1>faculty</h1>} />
        <Route path="projects" element={<h1>projects</h1>} />

        <Route path="/*" element={<PublicRoute />}>
          <Route path="login" element={<h1>Login page</h1>} />
          <Route path="forgot-password" element={<h1>Forgot password</h1>} />
          <Route path="verify-otp" element={<h1>Verify otp</h1>} />
          <Route path="reset-password" element={<h1>Rest password</h1>} />
        </Route>

        <Route path="/*" element={<PrivateRoute />}>
          <Route path="notices" element={<h1>Notices</h1>} />
        </Route>
      </Route>
    </Routes>
  );
}
