import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "@contexts/AuthProvider";
import MainRoutes from "@routes/MainRoutes";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <AuthProvider>
      <MainRoutes />
      <ToastContainer />
    </AuthProvider>
  );
}
