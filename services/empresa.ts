import { BaseApi } from "./BaseApi";
import type { Empresa, CadastrarEmpresa, AtualizarEmpresaDto, UUID } from "@/interfaces";

class EmpresaService extends BaseApi {
	constructor() {
		super("empresa");
	}

	async listar() {
		const response = await this.api.get<Empresa[]>("/listar");
		return response.data;
	}

	async cadastrar(data: CadastrarEmpresa) {
		return await this.api.post("/cadastrar", data);
	}

	async detalhes(id: UUID) {
		const response = await this.api.get<Empresa>(`/detalhes/${id}`);
		return response.data;
	}

	async atualizar(id: UUID, data: AtualizarEmpresaDto) {
		return await this.api.patch(`/atualizar/${id}`, data);
	}

	async remover(id: UUID) {
		return await this.api.delete(`/remover/${id}`);
	}
}

export const serviceEmpresa = new EmpresaService();
