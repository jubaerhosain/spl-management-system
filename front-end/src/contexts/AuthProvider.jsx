import { createContext, useState, useContext, useEffect } from "react";
import authService from "@services/api/authService";
import userService from "@services/api/userService";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthProvider() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const loadUserIfLoggedIn = async () => {
    setLoading(true);
    try {
      const response = await userService.getLoggedInUser();
      if (response.success) {
        setUser(response.data);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUserIfLoggedIn();
  }, []);

  async function login(data) {
    const response = await authService.login(data);

    setTimeout(() => {
      if (response.success) {
        loadUserIfLoggedIn();
      }
    }, 2000);

    return response;
  }

  async function logout() {
    const response = await authService.logout();

    setTimeout(() => {
      if (response.success) {
        setUser(null);
      }
    }, 2000);

    return response;
  }

  return <AuthContext.Provider value={{ loading, user, login, logout }}>{children}</AuthContext.Provider>;
}
