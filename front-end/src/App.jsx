import "./App.css";
// import FormContainer from "./common/form/components/FormContainer";
// import Home from "../Home/Home";
// import ForgotPassword from "../ForgotPassword/ForgotPassword";

import LoginForm from "./components/LoginForm";

function App() {
  // return <Home />;
  return (
    <div className="max-w-custom m-auto">
      {/* <ForgotPassword></ForgotPassword> */}
      <LoginForm></LoginForm>
    </div>
  );
}

export default App;
