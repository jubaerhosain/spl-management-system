import { useState } from "react";

import styles from "./PasswordInput.module.css";

export default function PasswordInput({ ...rest }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className={styles.inputContainer}>
      <input {...rest} type={visible ? "text" : "password"} className={styles.input} />
      <div className={styles.visibility} onClick={() => setVisible((prevState) => !prevState)}>
        {visible ? "Hide" : "Show"}
      </div>
    </div>
  );
}
