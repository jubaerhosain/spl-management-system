import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthProvider() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();

  useEffect(() => {
    // check logged-in and get user data
    setTimeout(() => {
      setLoading(false);
      setUser({ userType: "teacher" });
    }, 3000);
  });

  // Additional functions to handle login and logout

  async function login() {}
  async function logout() {}

  return (
    <AuthContext.Provider value={{ loading, setLoading, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
