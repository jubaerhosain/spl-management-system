import UserService from "@services/UserService";
import AuthService from "@services/AuthService";
import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthProvider() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const loadLoggedInUser = async () => {
    UserService.getLoggedInUser()
      .then((response) => {
        if (response.success) {
          console.log(response.data);
          setUser(response.data);
        } else {
          console.log(response);
          setUser(null);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadLoggedInUser();
  }, []);

  async function login(data) {
    const response = await AuthService.login(data);
    if (response.success) {
      loadLoggedInUser();
    }
    return response;
  }

  async function logout() {
    const response = await AuthService.logout();
    if (response.success) {
      setUser(null);
    }
    return response;
  }

  return <AuthContext.Provider value={{ loading, user, login, logout }}>{children}</AuthContext.Provider>;
}
