"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, PackageSearch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { formatarBRL, statusLabel, type StatusSolicitacao } from "@/lib/mock-data";
import { useMinhasSolicitacoes } from "@/lib/solicitacoes-store";

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

export default function MeusAlugueisPage() {
	const { user } = useAuth();
	const lista = useMinhasSolicitacoes(user?.nome);

	return (
		<div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
			<h1 className="text-2xl font-extrabold tracking-tight text-foreground">Meus aluguéis</h1>
			<p className="mt-1 text-muted-foreground">
				Acompanhe suas solicitações e finalize o pagamento quando o locador aceitar.
			</p>

			{lista.length === 0 ? (
				<div className="mt-10 flex flex-col items-center rounded-xl border border-dashed border-border p-12 text-center">
					<PackageSearch className="size-8 text-muted-foreground" />
					<p className="mt-3 font-medium text-foreground">
						Você ainda não solicitou nenhuma máquina.
					</p>
					<p className="mt-1 text-sm text-muted-foreground">
						Encontre o equipamento ideal e faça sua primeira solicitação.
					</p>
					<Button asChild className="mt-5">
						<Link href="/maquinas">Explorar máquinas</Link>
					</Button>
				</div>
			) : (
				<div className="mt-8 space-y-3">
					{lista.map((s) => (
						<Link
							key={s.id}
							href={`/meus-alugueis/${s.id}`}
							className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-muted/30"
						>
							<div className="relative hidden size-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:block">
								{s.maquinaImagem && (
									<Image
										src={s.maquinaImagem}
										alt={s.maquinaNome}
										fill
										sizes="80px"
										className="object-cover"
									/>
								)}
							</div>

							<div className="min-w-0 flex-1">
								<div className="flex flex-wrap items-center gap-2">
									<h2 className="truncate font-semibold text-foreground">{s.maquinaNome}</h2>
									<Badge variant={variantePorStatus[s.status]}>{statusLabel[s.status]}</Badge>
								</div>
								<p className="mt-1 text-sm text-muted-foreground">
									{s.locador} · {formatarData(s.dataInicio)} a {formatarData(s.dataFim)} ({s.dias}{" "}
									{s.dias === 1 ? "dia" : "dias"})
								</p>
								<p className="mt-1 text-sm font-medium text-foreground">{formatarBRL(s.total)}</p>
							</div>

							<div className="flex shrink-0 items-center gap-2">
								{s.status === "aceita" && (
									<span className="hidden text-sm font-medium text-primary sm:inline">
										Pagar agora
									</span>
								)}
								<ChevronRight className="size-5 text-muted-foreground" />
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
