import LoginForm from "@components/LoginForm/LoginForm";

export default function LoginPage() {
  return (
    <div className="max-w-custom flex flex-col m-auto flex-wrap items-center justify-around h-screen">
      <div className="max-w-md flex flex-col items-center justify-around">
        <a href="#" className="flex items-center mb-2 text-2xl font-semibold text-blue-900 dark:text-white">
          <img
            className="w-6 h-6 mr-2 rounded-sm"
            src="/iitlogo-blue.png"
            alt="logo"
          />
          Software Project Lab
        </a>
        <div className="w-full">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
