import { useState } from "react";
import SendOTPForm from "./components/SendOTPForm";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [OTP, setOTP] = useState("");
  const [OTPVerified, setOTPVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [resetPassword, setResetPassword] = useState("");

  const getForm = () => {
    if (!emailVerified)
      return <SendOTPForm email={email} setEmail={setEmail} setEmailVerified={setEmailVerified} />;
  };

  return (
    <div className="max-w-custom flex m-auto flex-wrap items-center justify-around h-screen">
      <div className="max-w-sm min-w-full flex flex-col items-center justify-around">
        <a href="#" className="flex items-center mb-2 text-2xl font-semibold text-blue-900 dark:text-white">
          <img className="w-6 h-6 mr-2 rounded-sm" src="/iitlogo-blue.png" alt="logo" />
          Software Project Lab
        </a>
        <div className="w-full">{getForm()}</div>
      </div>
    </div>
  );
}
