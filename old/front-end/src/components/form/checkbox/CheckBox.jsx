import styles from "./CheckBox.module.css";

export default function CheckBox({ children, id, ...rest }) {
  return (
    <div className={styles.checkboxContainer}>
      <div className={styles.inputDiv}>
        <input {...rest} id={id} type="checkbox" className={styles.input} />
      </div>
      <div className={styles.labelDiv}>
        <label htmlFor={id} className={styles.label}>
          {children}
        </label>
      </div>
    </div>
  );
}
