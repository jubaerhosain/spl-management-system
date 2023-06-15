import "./App.css";

import { HomePage, LoginPage } from "@pages";
import { AdminDashboard, StudentDashboard, TeacherDashboard } from "@pages/dashboard";

import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "@contexts/AuthProvider";
import PrivateOutlet from "@routes/PrivateOutlet";
import PublicOutlet from "@routes/PublicOutlet";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/*" element={<PublicOutlet />}>
          <Route path="" element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
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
