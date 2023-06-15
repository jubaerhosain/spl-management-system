import { useState } from "react";
import axios from "../../utils/api";

import FormHeading from "./FormHeading";
import Label from "./Label";
import Input from "./Input";
import CheckBox from "./CheckBox";
import ErrorText from "./ErrorText";
import LoginButton from "./LoginButton";
import ForgotPassword from "./ForgotPassword";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [checked, setChecked] = useState(false);

  const onEmailChange = (e) => {
    setEmail(e.target.value);
    setError(false);
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
    setError(false);
  };

  const handleCheckboxChange = () => {
    setChecked((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await axios.post("auth/login", {
        email: email,
        password: password,
        remember: checked,
      });

      if (user.data) {
        console.log(user);
      }
    } catch (err) {
      setError(true);
      console.log(err);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center px-4 py-4 md:h-screen lg:py-0 ">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <FormHeading> Login to your account </FormHeading>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
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
                placeholder="••••••••"
              />
            </div>

            <CheckBox checked={checked} onChange={handleCheckboxChange}>
              Remember me
            </CheckBox>

            {error && <ErrorText>Invalid email or password</ErrorText>}

            <LoginButton />

            <ForgotPassword />
          </form>
        </div>
      </div>
    </div>
  );
}
