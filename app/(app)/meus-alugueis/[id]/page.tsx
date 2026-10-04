"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
	ArrowLeft,
	CalendarDays,
	Check,
	FileText,
	MapPin,
	MessageSquare,
	PackageCheck,
	Star,
	Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AvaliacaoLocacao } from "@/components/marketplace/avaliacao-locacao";
import { ChatLocacao } from "@/components/marketplace/chat-locacao";
import { ContratoLocacao } from "@/components/marketplace/contrato-locacao";
import { cn } from "@/lib/utils";
import {
	COMISSAO_PERCENT,
	formatarBRL,
	statusLabel,
	type StatusSolicitacao,
} from "@/lib/mock-data";
import {
	concluirLocacao,
	confirmarRecebimento,
	type Solicitacao,
	useSolicitacao,
} from "@/lib/solicitacoes-store";

const DIA_MS = 86_400_000;

const variantePorStatus: Record<
	StatusSolicitacao,
	"default" | "secondary" | "outline" | "destructive"
> = {
	pendente: "default",
	aceita: "secondary",
	paga: "secondary",
	recusada: "destructive",
	concluida: "outline",
};

function dataLonga(iso: string) {
	return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

function dataHora(iso: string) {
	return new Date(iso).toLocaleString("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

/** Texto de "dias restantes" relativo ao período e ao status. */
function tempoRestante(s: Solicitacao): string {
	if (s.status === "concluida") return "Locação concluída";
	if (s.status === "recusada") return "Pedido recusado";
	const hoje = new Date();
	hoje.setHours(0, 0, 0, 0);
	const inicio = new Date(`${s.dataInicio}T00:00:00`);
	const fim = new Date(`${s.dataFim}T00:00:00`);
	if (hoje < inicio) {
		const d = Math.ceil((inicio.getTime() - hoje.getTime()) / DIA_MS);
		return `Começa em ${d} ${d === 1 ? "dia" : "dias"}`;
	}
	if (hoje <= fim) {
		const d = Math.ceil((fim.getTime() - hoje.getTime()) / DIA_MS);
		return `Faltam ${d} ${d === 1 ? "dia" : "dias"} para a devolução`;
	}
	return "Período encerrado — agende a devolução";
}

export default function AluguelDetalhePage() {
	const { id } = useParams<{ id: string }>();
	const s = useSolicitacao(id);

	if (!s) {
		return (
			<div className="mx-auto max-w-md px-4 py-16 text-center">
				<h1 className="text-xl font-bold text-foreground">Aluguel não encontrado</h1>
				<p className="mt-2 text-muted-foreground">Esse pedido não existe ou foi removido.</p>
				<Button asChild className="mt-6">
					<Link href="/meus-alugueis">Voltar para Meus aluguéis</Link>
				</Button>
			</div>
		);
	}

	const etapas = [
		{ chave: "solicitado", rotulo: "Solicitado", feito: true },
		{
			chave: "aceito",
			rotulo: "Aceito",
			feito: ["aceita", "paga", "concluida"].includes(s.status),
		},
		{ chave: "pago", rotulo: "Pago", feito: ["paga", "concluida"].includes(s.status) },
		{ chave: "recebido", rotulo: "Recebido", feito: s.recebido },
		{ chave: "concluido", rotulo: "Concluído", feito: s.status === "concluida" },
	];

	function receber() {
		if (!s) return;
		confirmarRecebimento(s.id);
		toast.success("Recebimento confirmado.");
	}

	function concluir() {
		if (!s) return;
		concluirLocacao(s.id);
		toast.success("Locação concluída. Que tal avaliar?");
	}

	return (
		<div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
			<Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
				<Link href="/meus-alugueis">
					<ArrowLeft className="size-4" />
					Meus aluguéis
				</Link>
			</Button>

			<div className="flex flex-wrap items-center gap-3">
				<h1 className="text-2xl font-extrabold tracking-tight text-foreground">{s.maquinaNome}</h1>
				<Badge variant={variantePorStatus[s.status]}>{statusLabel[s.status]}</Badge>
			</div>
			<p className="mt-1 text-muted-foreground">com {s.locador}</p>

			<div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
				<div className="space-y-8">
					{/* Acompanhamento */}
					<section>
						<h2 className="text-sm font-semibold text-foreground">Acompanhamento</h2>
						<ol className="mt-4 flex items-center">
							{etapas.map((etapa, i) => (
								<li key={etapa.chave} className="flex flex-1 items-center last:flex-none">
									<div className="flex flex-col items-center gap-1.5">
										<span
											className={cn(
												"flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold",
												etapa.feito
													? "border-primary bg-primary text-primary-foreground"
													: "border-border bg-card text-muted-foreground",
											)}
										>
											{etapa.feito ? <Check className="size-4" /> : i + 1}
										</span>
										<span
											className={cn(
												"text-[11px]",
												etapa.feito ? "font-medium text-foreground" : "text-muted-foreground",
											)}
										>
											{etapa.rotulo}
										</span>
									</div>
									{i < etapas.length - 1 && (
										<span
											className={cn(
												"mx-1 mb-5 h-0.5 flex-1",
												etapas[i + 1].feito ? "bg-primary" : "bg-border",
											)}
										/>
									)}
								</li>
							))}
						</ol>

						<div className="mt-5 flex items-center gap-2 rounded-xl bg-primary/5 p-4 text-sm">
							<CalendarDays className="size-4 shrink-0 text-primary" />
							<span className="font-medium text-foreground">{tempoRestante(s)}</span>
						</div>

						{/* Ações contextuais */}
						{s.status === "aceita" && (
							<Button asChild className="mt-4">
								<Link href={`/pagamento/${s.id}`}>Pagar agora</Link>
							</Button>
						)}
						{s.status === "paga" && !s.recebido && (
							<Button className="mt-4" onClick={receber}>
								<PackageCheck className="size-4" />
								Confirmar recebimento do equipamento
							</Button>
						)}
						{s.status === "paga" && s.recebido && (
							<div className="mt-4 space-y-3">
								<p className="flex items-center gap-2 text-sm text-muted-foreground">
									<PackageCheck className="size-4 text-primary" />
									Equipamento recebido em {s.recebidoEm ? dataHora(s.recebidoEm) : "—"}.
								</p>
								<Button variant="outline" onClick={concluir}>
									Registrar devolução e concluir
								</Button>
							</div>
						)}
					</section>

					{/* Entrega / frete */}
					<section>
						<h2 className="text-sm font-semibold text-foreground">Entrega</h2>
						<div className="mt-3 flex items-start gap-3 rounded-xl border border-border p-4 text-sm">
							{s.tipoEntrega === "entrega" ? (
								<Truck className="mt-0.5 size-5 shrink-0 text-primary" />
							) : (
								<MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
							)}
							<div>
								<p className="font-medium text-foreground">
									{s.tipoEntrega === "entrega" ? "Entrega no endereço" : "Retirada no local"}
								</p>
								<p className="text-muted-foreground">
									{s.tipoEntrega === "entrega"
										? `Frete de ${formatarBRL(s.frete)}, combinado com o locador.`
										: "Sem frete — combine a retirada com o locador pelo chat."}
								</p>
							</div>
						</div>
					</section>

					{/* Contrato */}
					<section>
						<h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
							<FileText className="size-4 text-primary" />
							Contrato
							{s.contratoAceito && (
								<Badge variant="secondary" className="font-normal">
									Aceito
								</Badge>
							)}
						</h2>
						<div className="mt-3 max-h-56 overflow-y-auto rounded-xl border border-border bg-muted/30 p-4">
							<ContratoLocacao solicitacao={s} />
						</div>
					</section>

					{/* Chat */}
					<section>
						<h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
							<MessageSquare className="size-4 text-primary" />
							Conversa com o locador
						</h2>
						<div className="mt-3">
							<ChatLocacao solicitacaoId={s.id} mensagens={s.mensagens} nomeLocador={s.locador} />
						</div>
					</section>

					{/* Avaliação */}
					{s.status === "concluida" && (
						<section>
							<h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
								<Star className="size-4 text-primary" />
								Avaliação
							</h2>
							<div className="mt-3">
								<AvaliacaoLocacao
									solicitacaoId={s.id}
									avaliacao={s.avaliacao}
									locador={s.locador}
								/>
							</div>
						</section>
					)}
				</div>

				{/* Resumo */}
				<aside>
					<div className="lg:sticky lg:top-24 space-y-4">
						<div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
							<div className="relative aspect-[16/10] bg-muted">
								{s.maquinaImagem && (
									<Image
										src={s.maquinaImagem}
										alt={s.maquinaNome}
										fill
										sizes="340px"
										className="object-cover"
									/>
								)}
							</div>
							<div className="p-5">
								<p className="text-sm text-muted-foreground">
									{dataLonga(s.dataInicio)} → {dataLonga(s.dataFim)}
								</p>
								<p className="mt-1 text-sm text-muted-foreground">
									{s.dias} {s.dias === 1 ? "diária" : "diárias"}
								</p>

								<dl className="mt-4 space-y-2 text-sm">
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Subtotal</dt>
										<dd className="text-foreground">{formatarBRL(s.subtotal)}</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Taxa de serviço ({COMISSAO_PERCENT}%)</dt>
										<dd className="text-foreground">{formatarBRL(s.taxa)}</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Frete</dt>
										<dd className="text-foreground">
											{s.frete > 0 ? formatarBRL(s.frete) : "Grátis"}
										</dd>
									</div>
									<div className="flex justify-between border-t border-border pt-2 text-base font-bold">
										<dt className="text-foreground">Total</dt>
										<dd className="text-foreground">{formatarBRL(s.total)}</dd>
									</div>
								</dl>

								<Button asChild variant="outline" className="mt-4 w-full">
									<Link href={`/maquinas/${s.maquinaId}`}>Ver anúncio da máquina</Link>
								</Button>
							</div>
						</div>
					</div>
				</aside>
			</div>
		</div>
	);
}
