import styles from "./Label.module.css";

export default function Label({ children, ...rest }) {
  return (
    <label {...rest} className={styles.label}>
      {children}
    </label>
  );
}
