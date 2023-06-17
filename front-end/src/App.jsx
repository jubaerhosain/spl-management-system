import "./App.css";

import { Route, Routes } from "react-router-dom";
import {
  HomePage,
  LoginPage,
  NotFoundPage,
  ForgotPasswordPage,
  VerifyOTPPage,
  ResetPasswordPage,
} from "@pages";

import { AuthProvider } from "@contexts/AuthProvider";
import { PrivateOutlet, PublicOutlet } from "@routes";
import { AdminDashboard, StudentDashboard, TeacherDashboard } from "@pages/dashboard";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/*" element={<NotFoundPage />} />
        <Route path="/" element={<HomePage />} />

        <Route path="/*" element={<PublicOutlet />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="verify-otp" element={<VerifyOTPPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>

        <Route path="/*" element={<PrivateOutlet />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="teacher" element={<TeacherDashboard />} />
          <Route path="student" element={<StudentDashboard />}>
            <Route path="profile" element={<h1>Student Profile</h1>}></Route>
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
