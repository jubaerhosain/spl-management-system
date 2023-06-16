import { Label, Input, SubmitButton, Title, FormContainer, Form } from "@components/common/form";

export default function SendOTPForm() {
  return (
    <FormContainer>
      <Title>Verify Email</Title>
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
          <span className="text-sm text-red-600"> Email does not exists </span>
        </div>
        <SubmitButton>Send OTP</SubmitButton>
      </Form>
    </FormContainer>
  );
}
