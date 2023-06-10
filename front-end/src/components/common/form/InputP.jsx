import { useState } from "react";

export default function InputP({ ...rest }) {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible((prevState) => !prevState);
  };

  return (
    <div className="relative w-full container mx-auto">
      <input
        {...rest}
        type={visible ? "text" : "password"}
        placeholder="••••••••••"
        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm 
        rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5
      dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
      dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      <p
        className="absolute inset-y-0 text-sm right-0 flex items-center px-4 text-blue-900 hover:cursor-pointer"
        onClick={toggleVisibility}
      >
        {visible ? "Hide" : "Show"}
      </p>
    </div>
  );
}
