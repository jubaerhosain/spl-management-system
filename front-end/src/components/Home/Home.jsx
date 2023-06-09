// import React from "react";
import LoginForm from "../LoginForm/LoginForm";

function LogoHeading() {
  return (
    <div href="#" className="flex flex-col items-center">
      <img className="w-28 h-28 mr-2 rounded-sm" src="/iitlogo-blue.png" alt="logo" />
      <h1 className="text-3xl text-center font-bold text-blue-900 mb-4 mt-2">SPL Management System</h1>
    </div>
  );
}

export default function Home() {
  return (
    <div className="max-w-custom flex flex-row flex-wrap items-center justify-around">
      <div className="max-w-lg flex-grow">
        <LogoHeading />
        <p className="text-justify text-lg text-blue-900">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione, quo cumque quod nobis magnam maiores
          commodi vitae accusamus similique tempora.
        </p>
      </div>
      <div className="max-w-sm min-w-max flex-grow">
        <LoginForm />
      </div>
    </div>
  );
}
