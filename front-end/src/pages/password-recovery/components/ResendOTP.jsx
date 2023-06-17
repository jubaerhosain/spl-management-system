export default function ResendOTP() {
  return (
    <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
      <p>Didn&apos;t receive code?</p>{" "}
      <span className="flex flex-row items-center text-blue-900 hover:cursor-pointer">Resend</span>
    </div>
  );
}
