"use client"

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
  name: string
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
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: {
    name: string
    email: string
    phone: string
    password: string
  }) => Promise<boolean>
  updateProfile: (userData: Partial<User>) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem("maqexpress_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simular autenticação - em produção, fazer chamada para API
      const mockUser: User = {
        id: "1",
        name: "João Silva",
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
      localStorage.setItem("maqexpress_user", JSON.stringify(mockUser))
      return true
    } catch (error) {
      console.error("Erro no login:", error)
      return false
    }
  }

  const register = async (userData: {
    name: string
    email: string
    phone: string
    password: string
  }): Promise<boolean> => {
    try {
      // Simular cadastro - em produção, fazer chamada para API
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        avatar: "/diverse-profile-avatars.png",
        useInternalPayment: true,
        createdAt: new Date().toISOString().split("T")[0],
      }

      setUser(newUser)
      localStorage.setItem("maqexpress_user", JSON.stringify(newUser))
      return true
    } catch (error) {
      console.error("Erro no cadastro:", error)
      return false
    }
  }

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false

      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("maqexpress_user", JSON.stringify(updatedUser))
      return true
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("maqexpress_user")
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
