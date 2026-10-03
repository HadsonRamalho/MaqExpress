import Link from "next/link";
import Image from "next/image";
import { MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatarBRL, type MaquinaMock } from "@/lib/mock-data";

export function MachineCard({ maquina }: { maquina: MaquinaMock }) {
	return (
		<Link
			href={`/maquinas/${maquina.id}`}
			className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
		>
			<div className="relative aspect-[4/3] overflow-hidden bg-muted">
				<Image
					src={maquina.imagem}
					alt={maquina.nome}
					fill
					sizes="(max-width: 768px) 100vw, 320px"
					className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
				/>
				{!maquina.disponivel && (
					<div className="absolute inset-0 flex items-center justify-center bg-background/60">
						<Badge variant="secondary" className="text-sm">
							Indisponível no momento
						</Badge>
					</div>
				)}
			</div>

			<div className="flex flex-1 flex-col p-4">
				<div className="flex items-center justify-between gap-2">
					<span className="text-xs font-medium text-muted-foreground">
						{maquina.categoriaNome}
					</span>
					<span className="flex items-center gap-1 text-xs font-medium text-foreground">
						<Star className="size-3.5 fill-primary text-primary" />
						{maquina.nota.toFixed(1)}
						<span className="text-muted-foreground">({maquina.avaliacoes})</span>
					</span>
				</div>

				<h3 className="mt-1.5 line-clamp-2 font-semibold leading-snug text-foreground">
					{maquina.nome}
				</h3>

				<p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
					<MapPin className="size-3.5" />
					{maquina.cidade} — {maquina.uf}
				</p>

				<div className="mt-4 flex items-end justify-between border-t border-border pt-3">
					<div>
						<span className="text-lg font-bold text-foreground">
							{formatarBRL(maquina.precoDia)}
						</span>
						<span className="text-sm text-muted-foreground"> / dia</span>
					</div>
					<span className="text-sm font-medium text-primary group-hover:underline">
						Ver detalhes
					</span>
				</div>
			</div>
		</Link>
	);
}
