import styles from "./SubmitButton.module.css";

// eslint-disable-next-line no-unused-vars
export default function SubmitButton({ children, width, ...rest }) {
  return (
    <button {...rest} type="submit" className={styles.submitButton}>
      {children}
    </button>
  );
}
