import styles from "./SubmitButton.module.css";

export default function SubmitButton({ children, ...rest }) {
  return (
    <button {...rest} type="submit" className={styles.submitButton}>
      {children}
    </button>
  );
}
