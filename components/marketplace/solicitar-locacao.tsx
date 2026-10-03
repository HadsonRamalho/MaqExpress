"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COMISSAO_PERCENT, formatarBRL } from "@/lib/mock-data";

const DIA_MS = 86_400_000;

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
	precoDia,
	precoSemana,
	disponivel,
}: {
	maquinaId: string;
	precoDia: number;
	precoSemana?: number;
	disponivel: boolean;
}) {
	const router = useRouter();
	const { user } = useAuth();
	const [inicio, setInicio] = useState("");
	const [fim, setFim] = useState("");
	const [enviando, setEnviando] = useState(false);

	const hoje = new Date().toISOString().slice(0, 10);

	const { dias, subtotal, taxa, total } = useMemo(() => {
		if (!inicio || !fim) return { dias: 0, subtotal: 0, taxa: 0, total: 0 };
		const diff = Math.round((new Date(fim).getTime() - new Date(inicio).getTime()) / DIA_MS);
		const dias = diff > 0 ? diff : 0;
		const subtotal = calcularSubtotal(dias, precoDia, precoSemana);
		const taxa = Math.round((subtotal * COMISSAO_PERCENT) / 100);
		return { dias, subtotal, taxa, total: subtotal + taxa };
	}, [inicio, fim, precoDia, precoSemana]);

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
		// Integração real com services/solicitacao entra quando o fluxo de pagamento existir.
		await new Promise((r) => setTimeout(r, 700));
		setEnviando(false);
		toast.success("Solicitação enviada! O locador vai responder em breve.");
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
