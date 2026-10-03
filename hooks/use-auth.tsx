"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { type Register, type PerfilPrivadoUsuario, type Login, TipoUsuario } from "@/interfaces";
import { serviceAutenticacao as AuthService } from "@/services/auth";

// TEMPORÁRIO: libera login/cadastro sem backend nem validação, só para testar o
// frontend mais rápido. Remover (voltar a false) quando o backend estiver no ar.
const DEV_AUTH_BYPASS = true;

function usuarioDev(email?: string): PerfilPrivadoUsuario {
	return {
		id_publico: 1,
		nome: email ? email.split("@")[0] : "Usuário Teste",
		email: email || "teste@maqexpress.com",
		cpf: "00000000000",
		tipo_login: "email",
		tipo_usuario: TipoUsuario.Usuario,
		ativo: true,
		data_cadastro: new Date().toISOString(),
	};
}

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
				if (DEV_AUTH_BYPASS) {
					setUser(usuarioDev(localStorage.getItem("MAQEXPRESS_DEV_EMAIL") ?? undefined));
					setIsLoading(false);
					return;
				}
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
		if (DEV_AUTH_BYPASS) {
			localStorage.setItem("MAQEXPRESS_TOKEN", "dev-token");
			localStorage.setItem("MAQEXPRESS_DEV_EMAIL", data.email || "");
			setUser(usuarioDev(data.email));
			return;
		}
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
		if (DEV_AUTH_BYPASS) {
			localStorage.setItem("MAQEXPRESS_TOKEN", "dev-token");
			localStorage.setItem("MAQEXPRESS_DEV_EMAIL", userData.email || "");
			setUser(usuarioDev(userData.email));
			return;
		}
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
		localStorage.removeItem("MAQEXPRESS_DEV_EMAIL");
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
