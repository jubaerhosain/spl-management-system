import "./App.css";

// import {
//   HomePage,
//   LoginPage,
//   NotFoundPage,
//   ForgotPasswordPage,
//   VerifyOTPPage,
//   ResetPasswordPage,
// } from "@pages";

import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "@contexts/AuthProvider";
import HomeRoutes from "./pages/HomePanel/routes/HomeRoutes";
import AdminRoutes from "./pages/AdminPanel/routes/AdminRoutes";
import TeacherRoutes from "./pages/TeacherPanel/routes/TeacherRoutes";

// import { PrivateOutlet, PublicOutlet } from "@routes";
// import { AdminDashboard, StudentDashboard, TeacherDashboard } from "@pages/dashboard";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/*" element={<HomeRoutes />}></Route>
        <Route path="/admin/*" element={<AdminRoutes />}></Route>
        <Route path="/teacher/*" element={<TeacherRoutes />}></Route>
        <Route path="/student/*" element={<h1>Student Routes</h1>}></Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
