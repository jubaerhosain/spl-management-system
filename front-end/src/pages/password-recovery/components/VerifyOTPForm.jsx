// import React from 'react'

import FormHeading from "../common/form/FormHeading";
import OTPInput from "../VerifyOTP/OTPInput";
import SubmitButton from "../common/form/SubmitButton";
import ResendOTP from "../VerifyOTP/ResendOTP";

export default function VerifyOTPForm({ email }) {
  return (
    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
      <div className="flex flex-col items-center justify-center text-center">
        <FormHeading>Verify OTP</FormHeading>
        <div className="flex flex-row text-sm font-medium text-gray-400">
          <p>We have sent a code to {email}</p>
        </div>
      </div>

      <div>
        <form action="" method="post">
          <div className="flex flex-col space-y-8">
            <div className="flex flex-row items-center justify-around mx-auto w-full max-w-xs">
              <OTPInput></OTPInput>
              <OTPInput></OTPInput>
              <OTPInput></OTPInput>
              <OTPInput></OTPInput>
              <OTPInput></OTPInput>
              <OTPInput></OTPInput>
            </div>

            <div className="flex flex-col space-y-5">
              <SubmitButton>Verify</SubmitButton>

              <ResendOTP></ResendOTP>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
