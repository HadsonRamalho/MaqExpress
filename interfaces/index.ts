export type UUID = string;

export interface Login {
	email: string;
	senha: string;
}

export interface Register {
	cpf: string;
	email: string;
	nome: string;
	senha: string;
	tipo_login: string;
}

export enum TipoUsuario {
	Admin = "Admin",
	Usuario = "Usuario",
}

export interface Usuario {
	id: UUID;
	id_publico: number;
	nome: string;
	email: string;
	cpf: string;
	tipo_login: string;
	tipo_usuario: TipoUsuario;
	ativo: boolean;
	data_cadastro: string;
}

export interface RetornoLogin {
	token: string;
	nome: string;
}

export interface PerfilPublicoUsuario {
	id_publico: number;
	nome: string;
	ativo: boolean;
	data_cadastro: string;
}

export interface PerfilPrivadoUsuario {
	id_publico: number;
	nome: string;
	email: string;
	cpf: string;
	tipo_login: string;
	tipo_usuario: TipoUsuario;
	ativo: boolean;
	data_cadastro: string;
}

export interface Empresa {
	id: UUID;
	id_publico: number;
	id_usuario: UUID;
	nome: string;
	cnpj: string;
	ativo: boolean;
	data_cadastro: string;
	data_atualizacao: string;
}

export interface CadastrarEmpresa {
	nome: string;
	cnpj: string;
}

export interface AtualizarEmpresaDto extends CadastrarEmpresa {
	ativo: boolean;
}

export interface Endereco {
	id: UUID;
	id_usuario: UUID;
	cep: string;
	uf: string;
	logradouro: string;
	bairro: string;
	cidade: string;
	numero: string;
	complemento?: string;
	data_cadastro: string;
}

export interface CadastrarEnderecoDto {
	cep: string;
	uf: string;
	logradouro: string;
	bairro: string;
	cidade: string;
	numero: string;
	complemento?: string;
}

export interface Maquina {
	id: UUID;
	id_publico: number;
	id_usuario?: UUID;
	id_empresa?: UUID;
	nome: string;
	descricao: string;
	numero_serie: string;
	ativo: boolean;
	data_cadastro: string;
	/** Preços em centavos de BRL. Diária obrigatória; semanal/mensal opcionais. */
	preco_diaria: number;
	preco_semanal?: number | null;
	preco_mensal?: number | null;
}

export interface CadastrarMaquina {
	nome: string;
	descricao: string;
	numero_serie: string;
	id_empresa?: UUID;
	/** Preços em centavos de BRL. */
	preco_diaria: number;
	preco_semanal?: number | null;
	preco_mensal?: number | null;
}

export interface AtualizarMaquinaDto extends CadastrarMaquina {
	ativo: boolean;
}

/** Imagem de uma máquina (metadados/URL; armazenamento via Supabase é posterior). */
export interface MaquinaImagem {
	id: UUID;
	id_maquina: UUID;
	url: string;
	ordem: number;
	principal: boolean;
	data_cadastro: string;
}

export interface AdicionarImagemDto {
	url: string;
	ordem?: number;
	principal?: boolean;
}

export interface SolicitacaoContrato {
	id: UUID;
	id_publico: number;
	id_maquina: UUID;
	id_usuario_solicitante: UUID;
	status: string; // "Pendente", "Aprovada", "Rejeitada".
	data_inicio: string;
	data_fim: string;
	data_criacao: string;
}

export interface Contrato {
	id: UUID;
	id_solicitacao: UUID;
	caminho_arquivo: string;
	data_geracao: string;
}

export interface CriarSolicitacaoDto {
	id_maquina: UUID;
	data_inicio: string;
	data_fim: string;
}
