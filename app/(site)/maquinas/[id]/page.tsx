import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, ShieldCheck, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SolicitarLocacao } from "@/components/marketplace/solicitar-locacao";
import { getMaquina } from "@/lib/mock-data";

export default async function MaquinaDetalhePage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const maquina = getMaquina(id);
	if (!maquina) notFound();

	const specs = [
		{ rotulo: "Categoria", valor: maquina.categoriaNome },
		{ rotulo: "Localização", valor: `${maquina.cidade} — ${maquina.uf}` },
		{ rotulo: "Locador", valor: maquina.locador },
		{
			rotulo: "Disponibilidade",
			valor: maquina.disponivel ? "Disponível" : "Indisponível no momento",
		},
	];

	return (
		<div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
			<nav className="mb-6 text-sm text-muted-foreground">
				<Link href="/maquinas" className="hover:text-foreground">
					Máquinas
				</Link>
				<span className="mx-2">/</span>
				<span className="text-foreground">{maquina.categoriaNome}</span>
			</nav>

			<div className="grid gap-8 lg:grid-cols-[1fr_380px]">
				<div>
					<div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-muted">
						<Image
							src={maquina.imagem}
							alt={maquina.nome}
							fill
							priority
							sizes="(max-width: 1024px) 100vw, 760px"
							className="object-cover"
						/>
					</div>

					<div className="mt-6">
						<div className="flex flex-wrap items-center gap-3">
							<Badge variant="secondary">{maquina.categoriaNome}</Badge>
							<span className="flex items-center gap-1 text-sm font-medium text-foreground">
								<Star className="size-4 fill-primary text-primary" />
								{maquina.nota.toFixed(1)}
								<span className="text-muted-foreground">({maquina.avaliacoes} avaliações)</span>
							</span>
						</div>

						<h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">
							{maquina.nome}
						</h1>
						<p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
							<MapPin className="size-4" />
							{maquina.cidade} — {maquina.uf}
						</p>

						<p className="mt-6 text-lg leading-relaxed text-foreground">{maquina.descricao}</p>

						<h2 className="mt-10 text-lg font-bold text-foreground">Ficha técnica</h2>
						<dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
							{specs.map((spec) => (
								<div key={spec.rotulo} className="flex justify-between border-b border-border pb-3">
									<dt className="text-muted-foreground">{spec.rotulo}</dt>
									<dd className="font-medium text-foreground">{spec.valor}</dd>
								</div>
							))}
						</dl>

						<div className="mt-8 flex items-start gap-3 rounded-xl bg-primary/5 p-4">
							<ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
							<p className="text-sm text-muted-foreground">
								Contrato digital e pagamento seguro pela plataforma. O valor só é cobrado depois que
								o locador aceita a solicitação.
							</p>
						</div>
					</div>
				</div>

				<aside>
					<div className="lg:sticky lg:top-24">
						<SolicitarLocacao
							maquinaId={maquina.id}
							precoDia={maquina.precoDia}
							precoSemana={maquina.precoSemana}
							disponivel={maquina.disponivel}
						/>
					</div>
				</aside>
			</div>
		</div>
	);
}
