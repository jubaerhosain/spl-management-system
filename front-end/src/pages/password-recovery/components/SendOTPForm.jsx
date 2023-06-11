import Label from "../../../common/form/components/Label";
import Input from "../../../common/form/components/Input";
import SubmitButton from "../../../common/form/components/SubmitButton";
import FormHeading from "../../../common/form/components/FormHeading";
import FormContainer from "../../../common/form/components/FormContainer";
import Form from "../../../common/form/components/Form";

export default function SendOTPForm() {
  return (
    <FormContainer>
      <FormHeading>Verify Email</FormHeading>
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
        <SubmitButton>Send OTP</SubmitButton>
      </Form>
    </FormContainer>
  );
}
