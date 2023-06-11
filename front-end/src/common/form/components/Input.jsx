import styles from "../../form/Form.module.css";

export default function Input({ ...rest }) {
  return <input {...rest} className={styles.input} />;
}
