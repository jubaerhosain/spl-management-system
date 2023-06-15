import { useNavigate, Outlet } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();

 
  return (
    <button onClick={() => navigate("/")}>
      {" "}
      StudentDashboard <Outlet></Outlet>
    </button>
  );
}
