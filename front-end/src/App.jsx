import "./App.css";

import { AuthProvider } from "@contexts/AuthProvider";
import MainRoutes from "@routes/MainRoutes";

export default function App() {
  return (
    <AuthProvider>
      <MainRoutes />
    </AuthProvider>
  );
}
