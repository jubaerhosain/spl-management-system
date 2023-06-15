import LoginForm from "@components/LoginForm/LoginForm";
import { useAuthProvider } from "@contexts/AuthProvider";
import { Navigate } from "react-router-dom";

export default function HomePage() {
  const { loggedIn, loading } = useAuthProvider();

  if (loading) {
    return <div>Loading....</div>;
  }

  if (loggedIn) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="max-w-custom flex flex-row m-auto flex-wrap items-center justify-around h-screen">
      <div className="max-w-lg flex-grow p-4">
        <div href="#" className="flex flex-col items-center">
          <img className="w-28 h-28 mr-2 rounded-sm" src="/iitlogo-blue.png" alt="logo" />
          <h1 className="text-3xl text-center font-bold text-blue-900 mb-4 mt-2">Software Project Lab</h1>
        </div>

        <p className="text-justify text-lg text-blue-900">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione, quo cumque quod nobis magnam
          maiores commodi vitae accusamus similique tempora.
        </p>
      </div>

      <div className="max-w-md min-w-max flex-grow">
        <LoginForm />
      </div>
    </div>
  );
}
