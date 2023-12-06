import { useState } from "react";

import styles from "./PasswordInput.module.css";

export default function PasswordInput({ ...rest }) {
  const [visible, setVisibility] = useState(false);

  const onClick = () => {
    setVisibility((prevState) => !prevState);
  };

  return (
    <div className={styles.inputContainer}>
      <input {...rest} type={visible ? "text" : "password"} className={styles.input} />
      <div className={styles.visibilityButton} onClick={onClick}>
        {visible ? "Hide" : "Show"}
      </div>
    </div>
  );
}
