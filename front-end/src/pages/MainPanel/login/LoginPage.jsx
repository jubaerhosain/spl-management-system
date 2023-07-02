import LoginForm from "./login-form/LoginForm";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  return (
    <div className={styles.loginPageContainer}>
      <div>
        <LoginForm />
      </div>
    </div>
  );
}
