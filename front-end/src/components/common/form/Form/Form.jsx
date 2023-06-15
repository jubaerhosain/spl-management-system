// import styles from "./Form.module.css";

export default function Form({ children, ...rest }) {
  return (
    <form {...rest} className="space-y-4 md:space-y-6">
      {children}
    </form>
  );
}
