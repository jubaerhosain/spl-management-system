export default function FormHeading({ children }) {
  return (
    <h1
      className="text-xl font-bold leading-tight tracking-tight 
         text-blue-900 md:text-2xl dark:text-white"
    >
      {children}
    </h1>
  );
}
