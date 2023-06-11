// import React from "react";

export default function FormContainer({ children }) {
  return (
    <div className="max-w-lg m-auto flex flex-col items-center justify-center px-4 py-4">
      <div
        className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 
      dark:border-gray-700 "
      >
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
