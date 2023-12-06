import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FormContainer } from "@layouts";
import { Title, SubmitButton, Form, Label, Input, Error } from "@components/form";
import AuthService from "@services/AuthService";
import styles from "./VerifyOTPForm.module.css";

export default function VerifyOTPForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  const [otp, setOTP] = useState("");
  const [isProcessing, setProcessing] = useState(false);
  const [otpError, setOTPError] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

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
    setProcessing(false);
  };

  return (
    <FormContainer>
      <Title>Verify OTP</Title>
      <div className={styles.sentOTPMessage}>
        <p>We have sent a OTP to {email}</p>
      </div>

      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="otp">Enter OTP</Label>
          <Input id="otp" type="number" required value={otp} onChange={(e) => setOTP(e.target.value)} />
          {otpError && <Error>{otpError}</Error>}
        </div>
        <div className="flex flex-col space-y-5">
          <SubmitButton disabled={isProcessing}>Verify</SubmitButton>

          <div className={styles.resendOTPDiv}>
            <p>Didn&apos;t receive code?</p>
            <span className={styles.resendOTPButton}>Resend</span>
          </div>
        </div>
      </Form>
    </FormContainer>
  );
}
