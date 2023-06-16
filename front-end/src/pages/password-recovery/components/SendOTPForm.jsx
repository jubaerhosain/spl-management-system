import { Label, Input, SubmitButton, Title, FormContainer, Form } from "@components/common/form";
import AuthService from "@services/AuthService";
import { useState } from "react";

export default function SendOTPForm({ email, setEmail, setEmailVerified }) {
  const [emailError, setEmailError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await AuthService.sendOTP(email);
    if (response.success) {
      setSuccessMessage(response.message);
      setTimeout(() => {
        setEmailVerified(true);
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
          {emailError && <span className="text-sm text-red-600"> {emailError} </span>}
          {successMessage && <div className="text-sm text-blue-900"> {successMessage} </div>}
        </div>
        <SubmitButton>Send OTP</SubmitButton>
      </Form>
    </FormContainer>
  );
}
