// import React from "react";
import LoginForm from "./LoginForm";

export default function Home() {
  return (
    <div className="flex flex-row items-center space-x-28 justify-center mt-20">
      <div className="max-w-lg flex-grow">
        <h1 className="text-3xl text-left font-bold text-blue-500 mb-4">SPL Management System</h1>
        <p className="text-justify text-lg">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione, quo cumque quod nobis
          magnam maiores commodi vitae accusamus similique tempora.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
