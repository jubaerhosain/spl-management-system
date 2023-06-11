// import React from "react";

import Form from "../common/form/components/Form";
import FormHeading from "../common/form/components/FormHeading";
import FormContainer from "../common/form/components/FormContainer";
import Label from "../common/form/components/Label";
import Input from "../common/form/components/Input";
import SingleError from "../common/form/components/SingleError";
import SubmitButton from "../common/form/components/SubmitButton";
// import CheckBox from "../common/form/components/CheckBox";

export default function LoginForm() {
  const error = false;
  return (
    <FormContainer>
      <FormHeading>Login to your account</FormHeading>
      <Form>
        <div>
          <Label htmlFor="email">Your email</Label>
          <Input
            // value={email}
            // onChange={onEmailChange}
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
            // value={password}
            // onChange={onPasswordChange}
            required
            type="password"
            name="password"
            id="password"
            placeholder="••••••••••"
          />
        </div>

        {/* <CheckBox checked={checked} onChange={handleCheckboxChange}>
          Remember me
        </CheckBox> */}

        {error && <SingleError>Invalid email or password</SingleError>}

        <SubmitButton> Login </SubmitButton>

        <div>
          <a href="#" className="text-sm text-blue-900 hover:underline dark:text-blue-500">
            Forgotten password?
          </a>
        </div>
      </Form>
    </FormContainer>
  );
}
