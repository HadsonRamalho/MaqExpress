"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { COMISSAO_PERCENT, formatarBRL } from "@/lib/mock-data";
import { criarSolicitacao, type TipoEntrega } from "@/lib/solicitacoes-store";

const DIA_MS = 86_400_000;
/** Frete fixo mock para entrega; retirada no local é grátis. */
const FRETE_ENTREGA = 180;

function calcularSubtotal(dias: number, precoDia: number, precoSemana?: number) {
	if (precoSemana && dias >= 7) {
		const semanas = Math.floor(dias / 7);
		const resto = dias % 7;
		return semanas * precoSemana + resto * precoDia;
	}
	return dias * precoDia;
}

export function SolicitarLocacao({
	maquinaId,
	maquinaNome,
	maquinaImagem,
	locador,
	precoDia,
	precoSemana,
	disponivel,
}: {
	maquinaId: string;
	maquinaNome: string;
	maquinaImagem?: string;
	locador: string;
	precoDia: number;
	precoSemana?: number;
	disponivel: boolean;
}) {
	const router = useRouter();
	const { user } = useAuth();
	const [inicio, setInicio] = useState("");
	const [fim, setFim] = useState("");
	const [tipoEntrega, setTipoEntrega] = useState<TipoEntrega>("retirada");
	const [enviando, setEnviando] = useState(false);

	const hoje = new Date().toISOString().slice(0, 10);
	const frete = tipoEntrega === "entrega" ? FRETE_ENTREGA : 0;

	const { dias, subtotal, taxa, total } = useMemo(() => {
		if (!inicio || !fim) return { dias: 0, subtotal: 0, taxa: 0, total: 0 };
		const diff = Math.round((new Date(fim).getTime() - new Date(inicio).getTime()) / DIA_MS);
		const dias = diff > 0 ? diff : 0;
		const subtotal = calcularSubtotal(dias, precoDia, precoSemana);
		const taxa = Math.round((subtotal * COMISSAO_PERCENT) / 100);
		return { dias, subtotal, taxa, total: subtotal + taxa + frete };
	}, [inicio, fim, precoDia, precoSemana, frete]);

	const periodoInvalido = Boolean(inicio && fim) && dias <= 0;

	async function solicitar() {
		if (!user) {
			toast.info("Entre na sua conta para solicitar a locação.");
			router.push(`/login?next=/maquinas/${maquinaId}`);
			return;
		}
		if (dias <= 0) {
			toast.error("Escolha um período válido.");
			return;
		}
		setEnviando(true);
		// Persistência real via services/solicitacao entra quando o backend expuser
		// o fluxo de pagamento (Mercado Pago + split).
		await new Promise((r) => setTimeout(r, 500));
		criarSolicitacao({
			maquinaId,
			maquinaNome,
			maquinaImagem,
			locador,
			solicitante: user.nome,
			dataInicio: inicio,
			dataFim: fim,
			dias,
			subtotal,
			taxa,
			frete,
			tipoEntrega,
			total,
		});
		setEnviando(false);
		toast.success("Solicitação enviada! Acompanhe em “Meus aluguéis”.");
		router.push("/meus-alugueis");
	}

	return (
		<div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
			<div className="flex items-baseline gap-1.5">
				<span className="text-2xl font-extrabold text-foreground">{formatarBRL(precoDia)}</span>
				<span className="text-muted-foreground">/ dia</span>
			</div>

			<div className="mt-4 grid grid-cols-2 gap-3">
				<div className="space-y-1.5">
					<Label htmlFor="inicio">Início</Label>
					<Input
						id="inicio"
						type="date"
						min={hoje}
						value={inicio}
						onChange={(e) => setInicio(e.target.value)}
					/>
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="fim">Devolução</Label>
					<Input
						id="fim"
						type="date"
						min={inicio || hoje}
						value={fim}
						onChange={(e) => setFim(e.target.value)}
					/>
				</div>
			</div>

			{periodoInvalido && (
				<p className="mt-2 text-sm text-destructive">A devolução precisa ser depois do início.</p>
			)}

			<div className="mt-4 space-y-1.5">
				<Label>Entrega</Label>
				<RadioGroup
					value={tipoEntrega}
					onValueChange={(v) => setTipoEntrega(v as TipoEntrega)}
					className="space-y-2"
				>
					<Label
						htmlFor="retirada"
						className="flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm font-normal has-[:checked]:border-primary has-[:checked]:bg-primary/5"
					>
						<span className="flex items-center gap-2 text-foreground">
							<RadioGroupItem value="retirada" id="retirada" />
							Retirada no local
						</span>
						<span className="text-muted-foreground">Grátis</span>
					</Label>
					<Label
						htmlFor="entrega"
						className="flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm font-normal has-[:checked]:border-primary has-[:checked]:bg-primary/5"
					>
						<span className="flex items-center gap-2 text-foreground">
							<RadioGroupItem value="entrega" id="entrega" />
							Entrega no endereço
						</span>
						<span className="text-muted-foreground">{formatarBRL(FRETE_ENTREGA)}</span>
					</Label>
				</RadioGroup>
			</div>

			{dias > 0 && (
				<dl className="mt-5 space-y-2 text-sm">
					<div className="flex justify-between">
						<dt className="text-muted-foreground">
							{formatarBRL(precoDia)} × {dias} {dias === 1 ? "dia" : "dias"}
						</dt>
						<dd className="text-foreground">{formatarBRL(subtotal)}</dd>
					</div>
					<div className="flex justify-between">
						<dt className="text-muted-foreground">Taxa de serviço ({COMISSAO_PERCENT}%)</dt>
						<dd className="text-foreground">{formatarBRL(taxa)}</dd>
					</div>
					<div className="flex justify-between">
						<dt className="text-muted-foreground">Frete</dt>
						<dd className="text-foreground">{frete > 0 ? formatarBRL(frete) : "Grátis"}</dd>
					</div>
					<div className="flex justify-between border-t border-border pt-2 text-base font-bold">
						<dt className="text-foreground">Total</dt>
						<dd className="text-foreground">{formatarBRL(total)}</dd>
					</div>
				</dl>
			)}

			<Button
				className="mt-5 w-full"
				size="lg"
				disabled={!disponivel || enviando}
				onClick={solicitar}
			>
				{!disponivel ? "Indisponível no momento" : enviando ? "Enviando..." : "Solicitar locação"}
			</Button>

			<p className="mt-3 text-center text-xs text-muted-foreground">
				Você só paga depois que o locador aceitar a solicitação.
			</p>
		</div>
	);
}
