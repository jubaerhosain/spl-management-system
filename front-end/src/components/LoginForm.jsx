// import React from "react";

import { useState } from "react";

// import styles from "../styles/Home.module.css";

export default function LoginFrom() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="max-w-sm flex-grow rounded-xl shadow-xl bg-white">
      <div className="flex flex-col items-center py-8">
        <h1 className="text-xl font-bold mb-4 text-blue-500">Login to SPLMS</h1>
        <form className="w-4/5">
          <div className="mb-4">
            <input
              required
              type="email"
              id="email"
              value={email}
              className="w-full px-2 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <input
              required
              type="password"
              id="password"
              value={password}
              className="w-full px-2 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full px-2 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
          >
            Log in
          </button>
        </form>
        <div className="mt-4 text-blue-500">
          <a href="#">Forgot your password?</a>
        </div>
      </div>
    </div>
  );
}
