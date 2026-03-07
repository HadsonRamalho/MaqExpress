import { BaseApi } from "./BaseApi";
import type { CadastrarEnderecoDto } from "@/interfaces";

class EnderecoService extends BaseApi {
    constructor() {
        super("enderecos");
    }

    async cadastrar(data: CadastrarEnderecoDto) {
        return await this.api.post("/cadastrar", data);
    }
}

export const serviceEndereco = new EnderecoService();
