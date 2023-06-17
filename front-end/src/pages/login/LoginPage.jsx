import LoginForm from "./login-form/LoginForm";

import { PageContainer } from "@layouts";

export default function LoginPage() {
  return (
    <PageContainer>
      <div className="max-w-sm min-w-full flex flex-col items-center justify-around">
        <div className="w-full">
          <LoginForm />
        </div>
      </div>
    </PageContainer>
  );
}
