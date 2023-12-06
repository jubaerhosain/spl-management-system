export default function FormHeading({ children }) {
    return (
      <h1 className="text-xl mt-0 text-center font-bold leading-tight tracking-tight  text-blue-900 md:text-2xl dark:text-white">
        {children}
      </h1>
    );
  }