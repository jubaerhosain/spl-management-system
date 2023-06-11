import styles from "../../form/Form.module.css";

export default function CheckBox({ children, id, ...rest }) {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          {...rest}
          id={id}
          aria-describedby="remember???"
          type="checkbox"
          className={styles.checkboxInput}
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={id} className={styles.checkboxLabel}>
          {children}
        </label>
      </div>
    </div>
  );
}
