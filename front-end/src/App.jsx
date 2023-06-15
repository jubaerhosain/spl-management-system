import "./App.css";
import { Route, Routes } from "react-router-dom";

import { HomePage, LoginPage } from "@pages";
import { AdminDashboard, StudentDashboard, TeacherDashboard } from "@pages/dashboard";
import { AuthProvider } from "@contexts/AuthProvider";
import { PrivateOutlet, PublicOutlet } from "@routes";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/*" element={<PublicOutlet />}>
          <Route path="" element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          {/* <Route path="redirect" element={<h>RedirectToDashboard</h>} /> */}
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
