import styles from "./ProfileButton.module.css";
import { useAuthProvider } from "@contexts/AuthProvider";

export default function ProfileButton({ ...rest }) {
  const { user } = useAuthProvider();

  return (
    <button {...rest} type="button" className={styles.profileButton}>
      <img src={user.avatar ? user.avatar : "blank_profile.svg"} alt="User" />
    </button>
  );
}
