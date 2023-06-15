// import SendOTPForm from "./SendOTPForm";
import FormLogoHeading from "../common/form/FormLogoHeading";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ForgotPassword() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-4 md:h-screen lg:py-0">
      <FormLogoHeading></FormLogoHeading>
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        {/* <SendOTPForm /> */}
        {/* <VerifyOTPForm></VerifyOTPForm> */}
        <ResetPasswordForm></ResetPasswordForm>
      </div>
    </div>
  );
}
