"use client"

import { Register } from "@/interfaces/auth"
import { AuthService } from "@/services/auth"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Address {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

interface BankInfo {
  bank: string
  agency: string
  account: string
  accountType: "corrente" | "poupanca"
  pixKey?: string
}

interface User {
  id: string
  nome: string
  email: string
  phone?: string
  avatar?: string
  address?: Address
  bankInfo?: BankInfo
  useInternalPayment: boolean
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: Register) => Promise<void>
  updateProfile: (userData: Partial<User>) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("MAQEXPRESS_USER")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, senha: string): Promise<void> => {
    try {
      const mockUser: User = {
        id: "1",
        nome: "João Silva",
        email: email,
        phone: "(11) 99999-9999",
        avatar: "/diverse-profile-avatars.png",
        useInternalPayment: false,
        createdAt: "2024-01-15",
        address: {
          street: "Rua das Flores",
          number: "123",
          complement: "Apto 45",
          neighborhood: "Centro",
          city: "São Paulo",
          state: "SP",
          zipCode: "01234-567",
        },
        bankInfo: {
          bank: "Banco do Brasil",
          agency: "1234-5",
          account: "12345-6",
          accountType: "corrente",
          pixKey: "joao.silva@email.com",
        },
      }

      setUser(mockUser)
      localStorage.setItem("MAQEXPRESS_USER", JSON.stringify(mockUser))

      await AuthService.login({ email, senha });
    } catch (error) {
      console.error("Erro no login:", error)
     }
  }

  const register = async (userData: Register) : Promise<void> => {
    try {
      const newUser: User = {
        id: Date.now().toString(),
        nome: userData.nome,
        email: userData.email,
        avatar: "/diverse-profile-avatars.png",
        useInternalPayment: true,
        createdAt: new Date().toISOString().split("T")[0],
      }

      setUser(newUser)
      localStorage.setItem("MAQEXPRESS_USER", JSON.stringify(newUser))

      await AuthService.cadastrar(userData);
    } catch (error) {
      console.error("Erro no cadastro:", error)
      throw new Error(`${error}`);
    }
  }

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    try {
      if (!user) throw new Error("O usuário não está logado")

      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("MAQEXPRESS_USER", JSON.stringify(updatedUser))
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("MAQEXPRESS_USER")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export type { User, Address, BankInfo }
