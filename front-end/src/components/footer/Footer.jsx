import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <p>
          © 2023
          <Link to="/" className={styles.link}>
            IIT.
          </Link>
          All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
