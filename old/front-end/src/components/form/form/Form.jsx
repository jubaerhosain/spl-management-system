import styles from "./Form.module.css";

export default function Form({ children, ...rest }) {
  return (
    <form {...rest} className={styles.form}>
      {children}
    </form>
  );
}
