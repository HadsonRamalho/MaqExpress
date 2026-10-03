import Link from "next/link";
import Image from "next/image";
import { CalendarCheck, FileCheck2, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSearch } from "@/components/marketplace/hero-search";
import { MachineCard } from "@/components/marketplace/machine-card";
import { categorias, maquinas } from "@/lib/mock-data";

const passos = [
	{
		icon: Search,
		titulo: "Busque",
		texto: "Encontre a máquina pela categoria, cidade e período que você precisa.",
	},
	{
		icon: CalendarCheck,
		titulo: "Solicite",
		texto: "Escolha as datas e envie a solicitação direto para o locador.",
	},
	{
		icon: FileCheck2,
		titulo: "Alugue",
		texto: "Pague com segurança, assine o contrato digital e retire a máquina.",
	},
];

export default function HomePage() {
	const destaques = maquinas.filter((m) => m.disponivel).slice(0, 4);

	return (
		<>
			{/* Hero */}
			<section className="border-b border-border/70 bg-gradient-to-b from-primary/5 to-background">
				<div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
					<div>
						<h1 className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
							A máquina certa para sua obra, sem burocracia.
						</h1>
						<p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
							Alugue equipamentos direto com quem tem, perto de você. Contrato
							digital, pagamento seguro e as datas que você precisa.
						</p>
						<div className="mt-8 max-w-2xl">
							<HeroSearch />
						</div>
						<p className="mt-4 text-sm text-muted-foreground">
							Mais de 500 máquinas disponíveis em Mato Grosso do Sul.
						</p>
					</div>

					<div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
						<Image
							src="/yellow-excavator-construction-site.png"
							alt="Escavadeira amarela em um canteiro de obras"
							fill
							priority
							sizes="(max-width: 1024px) 100vw, 480px"
							className="object-cover"
						/>
					</div>
				</div>
			</section>

			{/* Categorias */}
			<section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
				<div className="flex items-end justify-between gap-4">
					<h2 className="text-2xl font-bold tracking-tight text-foreground">
						Buscar por categoria
					</h2>
					<Link
						href="/maquinas"
						className="text-sm font-medium text-primary hover:underline"
					>
						Ver todas
					</Link>
				</div>
				<div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
					{categorias.map((categoria) => {
						const Icon = categoria.icon;
						return (
							<Link
								key={categoria.slug}
								href={`/maquinas?categoria=${categoria.slug}`}
								className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
							>
								<span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
									<Icon className="size-5" />
								</span>
								<span className="text-sm font-medium leading-tight text-foreground">
									{categoria.nome}
								</span>
							</Link>
						);
					})}
				</div>
			</section>

			{/* Destaques */}
			<section className="border-y border-border/70 bg-muted/30">
				<div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
					<div className="flex items-end justify-between gap-4">
						<h2 className="text-2xl font-bold tracking-tight text-foreground">
							Máquinas em destaque
						</h2>
						<Link
							href="/maquinas"
							className="text-sm font-medium text-primary hover:underline"
						>
							Ver todas
						</Link>
					</div>
					<div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
						{destaques.map((maquina) => (
							<MachineCard key={maquina.id} maquina={maquina} />
						))}
					</div>
				</div>
			</section>

			{/* Como funciona */}
			<section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
				<h2 className="text-2xl font-bold tracking-tight text-foreground">
					Como funciona
				</h2>
				<ol className="mt-8 grid gap-8 md:grid-cols-3">
					{passos.map((passo, i) => {
						const Icon = passo.icon;
						return (
							<li key={passo.titulo} className="relative">
								<div className="flex items-center gap-3">
									<span className="flex size-10 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
										{i + 1}
									</span>
									<Icon className="size-5 text-primary" />
								</div>
								<h3 className="mt-4 text-lg font-semibold text-foreground">
									{passo.titulo}
								</h3>
								<p className="mt-1.5 leading-relaxed text-muted-foreground">
									{passo.texto}
								</p>
							</li>
						);
					})}
				</ol>
			</section>

			{/* CTA locador */}
			<section className="border-t border-border/70 bg-primary/5">
				<div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between">
					<div className="max-w-xl">
						<h2 className="text-2xl font-bold tracking-tight text-foreground">
							Tem máquina parada? Coloque para render.
						</h2>
						<p className="mt-2 flex items-center gap-2 text-muted-foreground">
							<ShieldCheck className="size-5 text-primary" />
							Você define o preço e a disponibilidade. A gente cuida do contrato e
							do pagamento.
						</p>
					</div>
					<Button asChild size="lg">
						<Link href="/cadastrar-maquina">Anunciar máquina</Link>
					</Button>
				</div>
			</section>
		</>
	);
}
