import Link from "next/link";
import Image from "next/image";
import { Pencil, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatarBRL, minhasMaquinas } from "@/lib/mock-data";

export default function MinhasMaquinasPage() {
	return (
		<div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-extrabold tracking-tight text-foreground">
						Minhas máquinas
					</h1>
					<p className="mt-1 text-muted-foreground">
						Gerencie seus anúncios, preços e disponibilidade.
					</p>
				</div>
				<Button asChild>
					<Link href="/cadastrar-maquina">
						<PlusCircle className="size-4" />
						Anunciar máquina
					</Link>
				</Button>
			</div>

			<div className="mt-8 space-y-3">
				{minhasMaquinas.map((maquina) => (
					<div
						key={maquina.id}
						className="flex flex-col gap-4 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center"
					>
						<div className="relative h-24 w-full overflow-hidden rounded-lg bg-muted sm:h-20 sm:w-28">
							<Image
								src={maquina.imagem}
								alt={maquina.nome}
								fill
								sizes="160px"
								className="object-cover"
							/>
						</div>

						<div className="min-w-0 flex-1">
							<div className="flex items-center gap-2">
								<h2 className="truncate font-semibold text-foreground">{maquina.nome}</h2>
								<Badge variant={maquina.disponivel ? "secondary" : "outline"}>
									{maquina.disponivel ? "Ativa" : "Pausada"}
								</Badge>
							</div>
							<p className="mt-0.5 text-sm text-muted-foreground">
								{maquina.categoriaNome} · {maquina.cidade} — {maquina.uf}
							</p>
							<p className="mt-1 text-sm font-medium text-foreground">
								{formatarBRL(maquina.precoDia)}{" "}
								<span className="font-normal text-muted-foreground">/ dia</span>
							</p>
						</div>

						<div className="flex gap-2">
							<Button asChild variant="outline" size="sm">
								<Link href={`/maquinas/${maquina.id}`}>Ver anúncio</Link>
							</Button>
							<Button asChild variant="outline" size="sm">
								<Link href={`/editar-maquina/${maquina.id}`}>
									<Pencil className="size-4" />
									Editar
								</Link>
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
