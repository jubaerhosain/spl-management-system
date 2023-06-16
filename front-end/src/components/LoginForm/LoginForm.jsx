import { useState } from "react";
import { useAuthProvider } from "@contexts/AuthProvider";
import { FormContainer, Form, Input, Label, SubmitButton, Title, CheckBox, SingleError } from "@common/form";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState(false);
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
    const response = await login({ email, password, checked });
    if (!response.success) {
      setError(true);
    }
  };

  return (
    <FormContainer>
        {error && <SingleError>Invalid email or password</SingleError>}
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
          <Input
            value={password}
            onChange={onPasswordChange}
            required
            type="password"
            name="password"
            id="password"
            placeholder="••••••••••"
          />
        </div>

        <div className="flex items-center justify-between">
          <CheckBox id="checkbox" checked={checked} onChange={onCheck}>
            Remember me
          </CheckBox>
          <a
            href="#"
            className="text-sm lg:ml-20 md:ml-16 sm:ml-10 font-medium text-blue-900 hover:underline dark:text-blue-500"
          >
            Forgot password?
          </a>
        </div>

        <SubmitButton> Login </SubmitButton>

        <p className="text-sm font-light text-blue-900 dark:text-gray-400">
          Don&apos;t have an account yet?{" "}
          <a href="#" className="font-medium text-blue-900 hover:underline dark:text-blue-500">
            Register
          </a>
        </p>
      </Form>
    </FormContainer>
  );
}
