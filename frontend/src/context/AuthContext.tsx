import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";
import { RecruiterUserDTO, CompanyDTO } from "../types";

interface AuthContextType {
  user: RecruiterUserDTO | null;
  company: CompanyDTO | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<RecruiterUserDTO | null>(null);
  const [company, setCompany] = useState<CompanyDTO | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("ansoyal_recruiter_token"));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    try {
      const data = await api.get("/auth/me");
      setUser(data.recruiter);
      setCompany(data.company);
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const data = await api.post("/auth/login", { email, password });
    localStorage.setItem("ansoyal_recruiter_token", data.token);
    setToken(data.token);
    setUser(data.recruiter);
    setCompany(data.company);
  };

  const register = async (payload: any) => {
    const data = await api.post("/auth/register", payload);
    localStorage.setItem("ansoyal_recruiter_token", data.token);
    setToken(data.token);
    setUser(data.recruiter);
    setCompany(data.company);
  };

  const logout = () => {
    localStorage.removeItem("ansoyal_recruiter_token");
    setToken(null);
    setUser(null);
    setCompany(null);
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        company,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
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
