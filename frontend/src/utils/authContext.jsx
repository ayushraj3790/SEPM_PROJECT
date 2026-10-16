import { createContext, useContext, useState } from "react";
import { getAuthData, saveAuthData, clearAuthData } from "./auth.utils.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => getAuthData());

  const login = (data) => { saveAuthData(data); setAuth(data); };
  const logout = () => { clearAuthData(); setAuth(null); };

  return (
    <AuthContext.Provider value={{ auth, login, logout, isAuthenticated: !!auth?.user, ready: true }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
