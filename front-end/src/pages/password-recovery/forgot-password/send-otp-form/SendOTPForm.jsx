import { Label, Input, SubmitButton, Title, Form, Error } from "@components/form";
import { FormContainer } from "@layouts";
import AuthService from "@services/AuthService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SendOTPForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await AuthService.sendOTP(email);
    if (response.success) {
      setEmailError(null);
      setSuccessMessage(response.message);
      setTimeout(() => {
        navigate("/verify-otp", { state: { email } });
      }, 1000);
    } else if (response.errorCode === "BAD_REQUEST") {
      setEmailError(response.message);
    } else {
      setEmailError("An error occurred while sending OTP");
    }
  };

  return (
    <FormContainer>
      <Title>Verify Email</Title>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="email">Your email</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            name="email"
            id="email"
            placeholder="name@iit.du.ac.bd"
          />
          {emailError && <Error> {emailError} </Error>}
          {successMessage && <span className="text-sm text-blue-400"> {successMessage} </span>}
        </div>
        <SubmitButton>Send OTP</SubmitButton>
      </Form>
    </FormContainer>
  );
}
