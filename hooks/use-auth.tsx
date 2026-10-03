"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Register, PerfilPrivadoUsuario, Login } from "@/interfaces";
import { serviceAutenticacao as AuthService } from "@/services/auth";

interface AuthContextType {
	user: PerfilPrivadoUsuario | null;
	isLoading: boolean;
	login: (data: Login) => Promise<void>;
	register: (userData: Register) => Promise<void>;
	updateProfile: (userData: Partial<PerfilPrivadoUsuario>) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<PerfilPrivadoUsuario | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function loadStorageData() {
			const token = localStorage.getItem("MAQEXPRESS_TOKEN");

			if (token) {
				try {
					const profile = await AuthService.meuPerfil();
					setUser(profile);
				} catch {
					localStorage.removeItem("MAQEXPRESS_TOKEN");
					setUser(null);
				}
			}
			setIsLoading(false);
		}

		loadStorageData();
	}, []);

	const login = async (data: Login): Promise<void> => {
		try {
			const response = await AuthService.login(data);

			localStorage.setItem("MAQEXPRESS_TOKEN", response.token);

			const profile = await AuthService.meuPerfil();

			setUser(profile);
		} catch (error) {
			console.error("Erro no login:", error);
			throw error;
		}
	};

	const register = async (userData: Register): Promise<void> => {
		try {
			await AuthService.cadastrar(userData);
		} catch (error) {
			console.error("Erro no cadastro:", error);
			throw error;
		}
	};

	const updateProfile = async (userData: Partial<PerfilPrivadoUsuario>): Promise<void> => {
		try {
			if (!user) throw new Error("Usuário não autenticado");

			await AuthService.atualizarPerfil(userData);

			const updatedProfile = await AuthService.meuPerfil();
			setUser(updatedProfile);
		} catch (error) {
			console.error("Erro ao atualizar perfil:", error);
			throw error;
		}
	};

	const logout = () => {
		localStorage.removeItem("MAQEXPRESS_TOKEN");
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, isLoading, login, register, updateProfile, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
