import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthProvider } from "@contexts/AuthProvider";
import { FormContainer } from "@layouts";
import { Title, Form, Label, Input, PasswordInput, CheckBox, SubmitButton } from "@components/form";

import styles from "./LoginForm.module.css";

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [isProcessing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuthProvider();

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onCheck = () => {
    setChecked((prevState) => !prevState);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    const response = await login({ email, password, checked });

    if (response.success) {
      setError(null); 
      alert(response.message);
      navigate("/profile");
    } else if (response.errorCode == "BAD_REQUEST") {
      setError(response.message);
    } else {
      setError("An error occurred while logging in");
    }
    setProcessing(false);
  };

  return (
    <FormContainer>
      {error && <div className={styles.error}>{error}</div>}

      <Title>Login to your account</Title>

      <Form onSubmit={onSubmit}>
        <div>
          <Label htmlFor="email">Your email</Label>
          <Input
            value={email}
            onChange={onEmailChange}
            required
            type="email"
            name="email"
            id="email"
            placeholder="name@iit.du.ac.bd"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            value={password}
            onChange={onPasswordChange}
            required
            name="password"
            id="password"
            placeholder="••••••••••"
          />
        </div>

        <div className={styles.rememberAndForgotDiv}>
          <CheckBox id="checkbox" checked={checked} onChange={onCheck}>
            Remember me
          </CheckBox>
          <Link to="/forgot-password" className={styles.forgotPasswordLink}>
            Forgot password?
          </Link>
        </div>

        <SubmitButton disabled={isProcessing}> Login </SubmitButton>

        <p className={styles.registerDiv}>
          <span>Don&apos;t have an account yet?</span>
          <Link to="/register" className={styles.registerLink}>
            Register
          </Link>
        </p>
      </Form>
    </FormContainer>
  );
}
