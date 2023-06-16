import Label from "../common/form/Label";
import Input from "../common/form/Input";
import FormHeading from "../common/form/FormHeading";
import SubmitButton from "../common/form/SubmitButton";

import InputP from "../common/form/InputP";

export default function ResetPasswordForm() {
  return (
    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
      <FormHeading> Reset Password </FormHeading>
      <form className="space-y-4 md:space-y-6">
        <div>
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            // value={password}
            // onChange={onPasswordChange}
            required
            type="password"
            name="newPassword"
            id="newPassword"
            placeholder="••••••••"
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            // value={password}
            // onChange={onPasswordChange}
            required
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="••••••••"
          />
        </div>
        <SubmitButton>Reset</SubmitButton>

        <div>
          <Label htmlFor="i3">Confirm Password</Label>
          <InputP id="i3" />
        </div>
      </form>
    </div>
  );
}
