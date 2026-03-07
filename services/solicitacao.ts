import { BaseApi } from "./BaseApi";
import type { SolicitacaoContrato, Contrato, CriarSolicitacaoDto, UUID } from "@/interfaces";

class SolicitacaoService extends BaseApi {
    constructor() {
        super("solicitacao");
    }

    async criar(data: CriarSolicitacaoDto) {
        return await this.api.post("/criar", data);
    }

    async listarMinhasSolicitacoes() {
        const response = await this.api.get<SolicitacaoContrato[]>("/listar");
        return response.data;
    }

    async listarMeusContratos() {
        const response = await this.api.get<Contrato[]>("/contratos");
        return response.data;
    }

    async remover(id: UUID) {
        return await this.api.delete(`/remover/${id}`);
    }

    async responder(id: UUID, status: "Aprovada" | "Rejeitada") {
        return await this.api.patch(`/responder/${id}`, { status });
    }
}

export const serviceSolicitacao = new SolicitacaoService();
