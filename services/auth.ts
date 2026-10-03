import { BaseApi } from "./BaseApi";
import type { Login, Register, RetornoLogin, Usuario, PerfilPublicoUsuario } from "@/interfaces";

class AuthService extends BaseApi {
	constructor() {
		super("usuario");
	}

	async login(data: Login) {
		const response = await this.api.post<RetornoLogin>("/login", data);
		return response.data;
	}

	async cadastrar(data: Register) {
		return await this.api.post("/cadastrar", data);
	}

	async atualizarPerfil(data: Partial<Usuario>) {
		return await this.api.patch("/atualizar", data);
	}

	async meuPerfil() {
		const response = await this.api.get<Usuario>("/meu_perfil");
		return response.data;
	}

	async buscarPerfilPublico(idPublico: number) {
		const response = await this.api.get<PerfilPublicoUsuario>(`/perfil/`, {
			params: { id: idPublico },
		});
		return response.data;
	}
}

export const serviceAutenticacao = new AuthService();
