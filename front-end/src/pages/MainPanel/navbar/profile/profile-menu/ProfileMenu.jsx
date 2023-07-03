import { Link } from "react-router-dom";
import styles from "./ProfileMenu.module.css";
import { useAuthProvider } from "@contexts/AuthProvider";
import { toast } from "react-toastify";
import { useState } from "react";

export default function ProfileMenu() {
  const { user, logout } = useAuthProvider();
  const [signOutProcessing, setSignOutProcessing] = useState(false);

  const onSignOut = () => {
    setSignOutProcessing(true);
    logout()
      .then((response) => {
        if (response.success) {
          toast.success("Signed out successfully", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
        } else {
          toast.error("An error occurred while logging out", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
          setSignOutProcessing(false);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={styles.profileMenuContainer}>
      <div className={styles.identity}>
        <span>{user?.name}</span>
        <span>{user?.email}</span>
      </div>
      <ul>
        <li>
          <Link className={styles.link}>Dashboard</Link>
        </li>
        <li>
          <Link className={styles.link}>Settings</Link>
        </li>
        <button disabled={signOutProcessing} onClick={onSignOut} className={styles.link}>
          Sign out
        </button>
      </ul>
    </div>
  );
}
