"use client";

// Store client-side das solicitações de locação, persistido em localStorage.
// Permite validar o ciclo completo do MVP (solicitar → aceitar → pagar + aceite
// de contrato → recebimento → conclusão → avaliação) sem backend. Trocar por
// `services/solicitacao.ts` quando o backend expor o fluxo real.

import { useEffect, useSyncExternalStore } from "react";
import {
	COMISSAO_PERCENT,
	getMaquina,
	solicitacoesRecebidas,
	type StatusSolicitacao,
} from "@/lib/mock-data";

export type AutorMensagem = "locatario" | "locador";

export interface Mensagem {
	id: string;
	autor: AutorMensagem;
	texto: string;
	em: string;
}

export interface Avaliacao {
	nota: number; // 1 a 5
	comentario: string;
	em: string;
}

export type TipoEntrega = "retirada" | "entrega";

export interface Solicitacao {
	id: string;
	maquinaId: string;
	maquinaNome: string;
	maquinaImagem?: string;
	locador: string;
	solicitante: string;
	dataInicio: string;
	dataFim: string;
	dias: number;
	subtotal: number;
	taxa: number;
	frete: number;
	tipoEntrega: TipoEntrega;
	total: number;
	status: StatusSolicitacao;
	contratoAceito: boolean;
	recebido: boolean;
	recebidoEm?: string;
	mensagens: Mensagem[];
	avaliacao?: Avaliacao;
	criadaEm: string;
}

// V2: o formato da Solicitacao mudou (frete, recebimento, chat, avaliação).
const CHAVE = "MAQEXPRESS_SOLICITACOES_V2";

function mensagemLocadorInicial(locador: string): Mensagem {
	return {
		id: "msg-seed",
		autor: "locador",
		texto: `Olá! Aqui é da ${locador}. Qualquer dúvida sobre a máquina ou a retirada, é só chamar.`,
		em: new Date().toISOString(),
	};
}

/** Converte os pedidos-semente (visão do locador) para o formato do store. */
const semente: Solicitacao[] = solicitacoesRecebidas.map((s) => {
	const taxa = Math.round((s.valorTotal * COMISSAO_PERCENT) / (100 + COMISSAO_PERCENT));
	const maquina = getMaquina(s.maquinaId);
	const locador = maquina?.locador ?? "Locador";
	const concluida = s.status === "concluida";
	return {
		id: s.id,
		maquinaId: s.maquinaId,
		maquinaNome: s.maquinaNome,
		maquinaImagem: maquina?.imagem,
		locador,
		solicitante: s.solicitante,
		dataInicio: s.dataInicio,
		dataFim: s.dataFim,
		dias: s.dias,
		subtotal: s.valorTotal - taxa,
		taxa,
		frete: 0,
		tipoEntrega: "retirada" as TipoEntrega,
		total: s.valorTotal,
		status: s.status,
		contratoAceito: s.status === "paga" || concluida,
		recebido: concluida,
		recebidoEm: concluida ? `${s.dataInicio}T08:00:00` : undefined,
		mensagens: [mensagemLocadorInicial(locador)],
		avaliacao: undefined,
		criadaEm: `${s.dataInicio}T00:00:00`,
	};
});

let store: Solicitacao[] = semente;
let hidratado = false;
const ouvintes = new Set<() => void>();

function emitir() {
	for (const ouvinte of ouvintes) ouvinte();
}

function persistir() {
	try {
		localStorage.setItem(CHAVE, JSON.stringify(store));
	} catch {
		// localStorage indisponível (modo privado, etc.) — segue em memória.
	}
}

function hidratar() {
	if (hidratado || typeof window === "undefined") return;
	hidratado = true;
	try {
		const bruto = localStorage.getItem(CHAVE);
		if (bruto) {
			store = JSON.parse(bruto) as Solicitacao[];
			emitir();
		} else {
			persistir();
		}
	} catch {
		// Ignora dados corrompidos e mantém a semente.
	}
}

function subscrever(ouvinte: () => void) {
	ouvintes.add(ouvinte);
	return () => ouvintes.delete(ouvinte);
}

function snapshot() {
	return store;
}

function snapshotServidor() {
	return semente;
}

function atualizar(id: string, patch: Partial<Solicitacao>) {
	store = store.map((s) => (s.id === id ? { ...s, ...patch } : s));
	persistir();
	emitir();
}

export interface NovaSolicitacao {
	maquinaId: string;
	maquinaNome: string;
	maquinaImagem?: string;
	locador: string;
	solicitante: string;
	dataInicio: string;
	dataFim: string;
	dias: number;
	subtotal: number;
	taxa: number;
	frete: number;
	tipoEntrega: TipoEntrega;
	total: number;
}

export function criarSolicitacao(dados: NovaSolicitacao): Solicitacao {
	const nova: Solicitacao = {
		...dados,
		id: `sol-${Date.now().toString(36)}`,
		status: "pendente",
		contratoAceito: false,
		recebido: false,
		mensagens: [mensagemLocadorInicial(dados.locador)],
		criadaEm: new Date().toISOString(),
	};
	store = [nova, ...store];
	persistir();
	emitir();
	return nova;
}

export function responderSolicitacao(
	id: string,
	status: Extract<StatusSolicitacao, "aceita" | "recusada">,
) {
	atualizar(id, { status });
}

export function registrarPagamento(id: string) {
	atualizar(id, { status: "paga", contratoAceito: true });
}

export function confirmarRecebimento(id: string) {
	atualizar(id, { recebido: true, recebidoEm: new Date().toISOString() });
}

export function concluirLocacao(id: string) {
	atualizar(id, { status: "concluida" });
}

export function enviarMensagem(id: string, autor: AutorMensagem, texto: string) {
	const limpo = texto.trim();
	if (!limpo) return;
	const atual = store.find((s) => s.id === id);
	if (!atual) return;
	const mensagem: Mensagem = {
		id: `msg-${Date.now().toString(36)}`,
		autor,
		texto: limpo,
		em: new Date().toISOString(),
	};
	atualizar(id, { mensagens: [...atual.mensagens, mensagem] });
}

export function avaliarLocacao(id: string, nota: number, comentario: string) {
	atualizar(id, {
		avaliacao: { nota, comentario: comentario.trim(), em: new Date().toISOString() },
	});
}

/** Lista reativa completa (visão do locador: todos os pedidos recebidos). */
export function useSolicitacoes(): Solicitacao[] {
	const lista = useSyncExternalStore(subscrever, snapshot, snapshotServidor);
	useEffect(() => {
		hidratar();
	}, []);
	return lista;
}

/** Pedidos feitos pelo usuário logado (visão do locatário). */
export function useMinhasSolicitacoes(solicitante: string | undefined): Solicitacao[] {
	const lista = useSolicitacoes();
	if (!solicitante) return [];
	return lista.filter((s) => s.solicitante === solicitante);
}

export function useSolicitacao(id: string): Solicitacao | undefined {
	const lista = useSolicitacoes();
	return lista.find((s) => s.id === id);
}
