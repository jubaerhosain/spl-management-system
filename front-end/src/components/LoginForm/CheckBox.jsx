export default function CheckBox({ children, ...rest }) {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          {...rest}
          id="remember"
          aria-describedby="remember"
          type="checkbox"
          className="w-4 h-4 border border-blue-950 rounded bg-blue-900 
            focus:ring-blue-900 dark:bg-gray-700 dark:border-gray-600 
            dark:focus:ring-blue-600 dark:ring-offset-gray-800"
          required=""
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor="remember" className="text-blue-900 dark:text-gray-300">
          {children}
        </label>
      </div>
    </div>
  );
}
