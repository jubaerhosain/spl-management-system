import { FormContainer } from "@layouts";
import { Title, SubmitButton, Form, Label, Input, Error, PasswordInput } from "@components/form";

import AuthService from "@services/AuthService";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, otp } = location.state || {};

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState(null);

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }

    if (!otp) {
      navigate("/verify-otp");
    }
  }, [email, navigate, otp]);

  const onNewPasswordInput = (e) => {
    setNewPassword(e.target.value);
    setPasswordMatchError(false);
    setNewPasswordError(false);
  };

  const onConfirmPasswordInput = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatchError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      setNewPasswordError("Password must be at least 8 character long");
    } else if (newPassword == confirmPassword) {
      const response = await AuthService.resetPassword(email, otp, newPassword);
      if (response.success) {
        alert("Password reset successfully");
        navigate("/login");
      } else {
        console.log(response);
      }
    } else {
      setPasswordMatchError(true);
    }
  };

  return (
    <FormContainer>
      <Title> Reset Password </Title>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="newPassword">New Password</Label>
          <PasswordInput
            value={newPassword}
            onChange={onNewPasswordInput}
            required
            placeholder="New password"
            name="newPassword"
            id="newPassword"
          />
          {newPasswordError && <Error> {newPasswordError} </Error>}
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            value={confirmPassword}
            onChange={onConfirmPasswordInput}
            required
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm password"
          />
          {passwordMatchError && <Error>Password doesn&apos;t match </Error>}
        </div>
        <SubmitButton>Reset</SubmitButton>
      </Form>
    </FormContainer>
  );
}
