import Label from "../common/form/Label";
import Input from "../common/form/Input";
import SubmitButton from "../common/form/SubmitButton";
import FormHeading from "../common/form/FormHeading";

export default function SendOTPForm() {
  return (
    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
      <FormHeading> Verify Email </FormHeading>
      <form className="space-y-4 md:space-y-6">
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
      </form>
    </div>
  );
}
