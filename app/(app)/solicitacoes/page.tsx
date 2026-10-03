"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Inbox, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	formatarBRL,
	solicitacoesRecebidas,
	statusLabel,
	type StatusSolicitacao,
} from "@/lib/mock-data";

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

function formatarData(iso: string) {
	return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "short",
	});
}

export default function SolicitacoesPage() {
	const [lista, setLista] = useState(solicitacoesRecebidas);

	function responder(id: string, status: StatusSolicitacao) {
		setLista((atual) => atual.map((s) => (s.id === id ? { ...s, status } : s)));
		toast.success(
			status === "aceita"
				? "Solicitação aceita. O locatário será avisado para pagar."
				: "Solicitação recusada.",
		);
	}

	return (
		<div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
			<h1 className="text-2xl font-extrabold tracking-tight text-foreground">
				Solicitações recebidas
			</h1>
			<p className="mt-1 text-muted-foreground">
				Aceite ou recuse os pedidos de locação das suas máquinas.
			</p>

			{lista.length === 0 ? (
				<div className="mt-10 flex flex-col items-center rounded-xl border border-dashed border-border p-12 text-center">
					<Inbox className="size-8 text-muted-foreground" />
					<p className="mt-3 font-medium text-foreground">Nenhuma solicitação por aqui.</p>
					<p className="mt-1 text-sm text-muted-foreground">
						Quando alguém solicitar uma máquina sua, ela aparece aqui.
					</p>
				</div>
			) : (
				<div className="mt-8 space-y-3">
					{lista.map((s) => (
						<div
							key={s.id}
							className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
						>
							<div className="min-w-0">
								<div className="flex items-center gap-2">
									<h2 className="truncate font-semibold text-foreground">{s.maquinaNome}</h2>
									<Badge variant={variantePorStatus[s.status]}>{statusLabel[s.status]}</Badge>
								</div>
								<p className="mt-1 text-sm text-muted-foreground">
									{s.solicitante} · {formatarData(s.dataInicio)} a {formatarData(s.dataFim)} (
									{s.dias} {s.dias === 1 ? "dia" : "dias"})
								</p>
								<p className="mt-1 text-sm font-medium text-foreground">
									{formatarBRL(s.valorTotal)}
								</p>
							</div>

							{s.status === "pendente" && (
								<div className="flex gap-2">
									<Button size="sm" onClick={() => responder(s.id, "aceita")}>
										<Check className="size-4" />
										Aceitar
									</Button>
									<Button size="sm" variant="outline" onClick={() => responder(s.id, "recusada")}>
										<X className="size-4" />
										Recusar
									</Button>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
