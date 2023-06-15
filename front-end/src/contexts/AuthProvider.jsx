import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthProvider() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(true);
  const [user, setUser] = useState({userType: "admin"});

  useEffect(() => {
    // check logged-in and get user data
    // setTimeout(() => {
    //   setLoading(false);
    //   setLoggedIn(true);
    //   setUser({ id: 1, name: "John Doe" });
    // }, 3000);
  });

  // Additional functions to handle login and logout

  async function login() {}
  async function logout() {}

  return (
    <AuthContext.Provider
      value={{ loading, setLoading, loggedIn, setLoggedIn, user, setUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
