import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem("hf_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [role, setRole] = useState(() => {
    try {
      return sessionStorage.getItem("hf_role") || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user && role) {
      sessionStorage.setItem("hf_user", JSON.stringify(user));
      sessionStorage.setItem("hf_role", role);
    } else {
      sessionStorage.removeItem("hf_user");
      sessionStorage.removeItem("hf_role");
    }
  }, [user, role]);

  const login = (userData, userRole) => {
    setUser(userData);
    setRole(userRole);
  };

  const logout = async () => {
    try {
      if (role === "admin") {
        await authApi.adminLogout();
      } else {
        await authApi.candidateLogout();
      }
    } catch {
    } finally {
      setUser(null);
      setRole(null);
      sessionStorage.removeItem("hf_user");
      sessionStorage.removeItem("hf_role");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
