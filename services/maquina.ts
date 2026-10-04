import { BaseApi } from "./BaseApi";
import type {
	AdicionarImagemDto,
	AtualizarMaquinaDto,
	CadastrarMaquina,
	Maquina,
	MaquinaImagem,
	UUID,
} from "@/interfaces";

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

	async listarImagens(idMaquina: UUID) {
		const response = await this.api.get<MaquinaImagem[]>(`/${idMaquina}/imagens`);
		return response.data;
	}

	async adicionarImagem(idMaquina: UUID, data: AdicionarImagemDto) {
		return await this.api.post(`/${idMaquina}/imagens`, data);
	}

	async removerImagem(idMaquina: UUID, idImagem: UUID) {
		return await this.api.delete(`/${idMaquina}/imagens/${idImagem}`);
	}
}

export const serviceMaquina = new MaquinaService();
