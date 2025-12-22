"use client";

import { UserId } from "@/interfaces/user";
import { loginUser } from "@/services/api/user/user";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

interface AuthCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: UserId | null;
  signIn(credentials: AuthCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserId | null>(null);

  // ✔ Carrega do localStorage apenas no client
  useEffect(() => {
    const userId = localStorage.getItem("USER_ID");
    if (userId) {
      setUser({ idusuario: userId });
    }
  }, []);

  const signIn = useCallback(async ({ email, password }: AuthCredentials) => {
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("USER_ID", data.idusuario);
      setUser(data);
    } catch (error: any) {
      const statusCode = error.response?.status;

      if (statusCode === 401) {
        throw new Error("Credenciais inválidas. Verifique seu e-mail e senha.");
      } else if (statusCode === 500) {
        throw new Error("Erro no servidor. Por favor, tente novamente mais tarde.");
      } else {
        throw new Error(`Erro inesperado: ${statusCode || error.message}`);
      }
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("USER_ID");
    setUser(null);
  }, []);

  const providerData = useMemo(() => ({ user, signIn, signOut }), [user, signIn, signOut]);

  return (
    <AuthContext.Provider value={providerData}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
