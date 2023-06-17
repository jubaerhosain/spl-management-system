import { useEffect, useState } from "react";

import { FormContainer } from "@layouts";
import { Title, SubmitButton, Form, Label, Input, Error } from "@components/form";

import ResendOTP from "./ResendOTP";
import AuthService from "@services/AuthService";

import { useNavigate, useLocation } from "react-router-dom";

export default function VerifyOTPForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  const [otp, setOTP] = useState("");
  const [OTPError, setOTPError] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await AuthService.verifyOTP(email, otp);
    if (response.success) {
      setTimeout(() => {
        // navigate to the next
        setOTPError(null);
        navigate("/reset-password", { state: { email, otp } });
      }, 1000);
    } else if (response.errorCode == "BAD_REQUEST") {
      setOTPError(response.message);
    } else {
      setOTPError("An error occurred while verifying OTP");
    }
  };

  return (
    <FormContainer>
      <Title>Verify OTP</Title>
      <div className="flex flex-row text-sm font-medium text-gray-400">
        <p>We have sent a OTP to {email}</p>
      </div>

      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="otp">Enter OTP</Label>
          <Input id="otp" type="number" required value={otp} onChange={(e) => setOTP(e.target.value)} />
          {OTPError && <Error>{OTPError}</Error>}
        </div>
        <div className="flex flex-col space-y-5">
          <SubmitButton>Verify</SubmitButton>

          <ResendOTP />
        </div>
      </Form>
    </FormContainer>
  );
}
