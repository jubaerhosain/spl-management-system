export default function Label({ children, ...rest }) {
  return (
    <label {...rest} className="block mb-2 text-left text-sm font-medium text-blue-900 dark:text-white">
      {children}
    </label>
  );
}
