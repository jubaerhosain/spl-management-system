export default function LoginButton({ ...rest }) {
  return (
    <button
      {...rest}
      type="submit"
      className="w-full text-white text-base bg-blue-900 hover:bg-blue-950 focus:ring-2
            focus:outline-none 
          focus:ring-blue-900 font-medium rounded-lg px-5 py-2.5 text-center dark:bg-blue-600 
          dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      Login
    </button>
  );
}
