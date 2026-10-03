import { BaseApi } from "./BaseApi";
import type { Maquina, CadastrarMaquina, AtualizarMaquinaDto, UUID } from "@/interfaces";

class MaquinaService extends BaseApi {
	constructor() {
		super("maquina");
	}

	async listar() {
		const response = await this.api.get<Maquina[]>("/listar");
		return response.data;
	}

	async cadastrar(data: CadastrarMaquina) {
		return await this.api.post("/cadastrar", data);
	}

	async atualizar(id: UUID, data: AtualizarMaquinaDto) {
		return await this.api.patch(`/atualizar/${id}`, data);
	}

	async remover(id: UUID) {
		return await this.api.delete(`/remover/${id}`);
	}
}

export const serviceMaquina = new MaquinaService();
