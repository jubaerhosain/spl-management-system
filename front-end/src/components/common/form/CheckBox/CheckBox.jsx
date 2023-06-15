// import styles from "./Checkbox.module.css";

export default function CheckBox({ children, id, ...rest }) {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          {...rest}
          id={id}
          aria-describedby={id}
          type="checkbox"
          className="w-4 h-4 border border-blue-950 rounded bg-blue-950 focus:ring-blue-950 dark:bg-gray-700 
          dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={id} className="text-blue-900 dark:text-gray-300">
          {children}
        </label>
      </div>
    </div>
  );
}
