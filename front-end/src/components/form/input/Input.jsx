import styles from "./Input.module.css";

export default function Input({ ...rest }) {
  return <input {...rest} className={styles.input} />;
}
