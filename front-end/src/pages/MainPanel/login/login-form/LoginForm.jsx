import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthProvider } from "@contexts/AuthProvider";
import { toast } from "react-toastify";
import {
  Title,
  Form,
  Label,
  Input,
  PasswordInput,
  CheckBox,
  SubmitButton,
  FormContainer,
  FormGroup,
} from "@components/form";

import styles from "./LoginForm.module.css";

export default function LoginForm() {
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

    if (isProcessing) return;

    setProcessing(true);
    login({ email, password, checked })
      .then((response) => {
        if (response.success) {
          setError(null);
          toast.success(response.message, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
          // automatically redirected to dashboard as auth state changes
        } else {
          if (response.errorCode == "BAD_REQUEST") {
            setError(response.message);
          } else {
            setError("An error occurred while logging in");
          }
          setProcessing(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <FormContainer>
      {error && <div className={styles.error}>{error}</div>}

      <Title>Login to your account</Title>

      <Form onSubmit={onSubmit}>
        <FormGroup>
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
        </FormGroup>

        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            value={password}
            onChange={onPasswordChange}
            required
            name="password"
            id="password"
            placeholder="••••••••••"
          />
        </FormGroup>

        <FormGroup className={styles.rememberAndForgotDiv}>
          <CheckBox id="checkbox" checked={checked} onChange={onCheck}>
            Remember me
          </CheckBox>
          <Link to="/forgot-password" className={styles.forgotPasswordLink}>
            Forgot password?
          </Link>
        </FormGroup>

        <SubmitButton disabled={isProcessing}> Login </SubmitButton>

        <FormGroup className={styles.registerDiv}>
          <span>Don&apos;t have an account yet?</span>
          <Link to="/register" className={styles.registerLink}>
            Register
          </Link>
        </FormGroup>
      </Form>
    </FormContainer>
  );
}
