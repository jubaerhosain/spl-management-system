import styles from "./FormContainer.module.css";

export default function FormContainer({ children }) {
  return (
    <section className={styles.container}>
      <div>{children}</div>
    </section>
  );
}
