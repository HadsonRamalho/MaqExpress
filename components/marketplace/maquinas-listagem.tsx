"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MachineCard } from "@/components/marketplace/machine-card";
import { categorias, formatarBRL, maquinas } from "@/lib/mock-data";

type Ordenacao = "relevancia" | "menor" | "maior" | "avaliadas";

const PRECO_MAX = 1500;

function Filtros({
	categoriasSel,
	toggleCategoria,
	precoMax,
	setPrecoMax,
	somenteDisponiveis,
	setSomenteDisponiveis,
}: {
	categoriasSel: string[];
	toggleCategoria: (slug: string) => void;
	precoMax: number;
	setPrecoMax: (v: number) => void;
	somenteDisponiveis: boolean;
	setSomenteDisponiveis: (v: boolean) => void;
}) {
	return (
		<div className="space-y-8">
			<div>
				<h3 className="text-sm font-semibold text-foreground">Categorias</h3>
				<div className="mt-3 space-y-1">
					{categorias.map((categoria) => {
						const ativo = categoriasSel.includes(categoria.slug);
						return (
							<button
								key={categoria.slug}
								type="button"
								onClick={() => toggleCategoria(categoria.slug)}
								className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors ${
									ativo
										? "bg-primary/10 font-medium text-foreground"
										: "text-muted-foreground hover:bg-muted"
								}`}
								aria-pressed={ativo}
							>
								<span
									className={`size-4 rounded border ${ativo ? "border-primary bg-primary" : "border-input"}`}
								/>
								{categoria.nome}
							</button>
						);
					})}
				</div>
			</div>

			<div>
				<div className="flex items-center justify-between">
					<h3 className="text-sm font-semibold text-foreground">Preço por dia</h3>
					<span className="text-sm text-muted-foreground">até {formatarBRL(precoMax)}</span>
				</div>
				<Slider
					value={[precoMax]}
					onValueChange={([v]) => setPrecoMax(v)}
					min={50}
					max={PRECO_MAX}
					step={50}
					className="mt-4"
				/>
			</div>

			<div className="flex items-center justify-between">
				<Label htmlFor="disponiveis" className="text-sm font-medium">
					Somente disponíveis
				</Label>
				<Switch
					id="disponiveis"
					checked={somenteDisponiveis}
					onCheckedChange={setSomenteDisponiveis}
				/>
			</div>
		</div>
	);
}

export function MaquinasListagem() {
	const searchParams = useSearchParams();
	const categoriaInicial = searchParams.get("categoria");
	const buscaInicial = searchParams.get("busca") ?? "";

	const [busca, setBusca] = useState(buscaInicial);
	const [categoriasSel, setCategoriasSel] = useState<string[]>(
		categoriaInicial ? [categoriaInicial] : [],
	);
	const [precoMax, setPrecoMax] = useState(PRECO_MAX);
	const [somenteDisponiveis, setSomenteDisponiveis] = useState(false);
	const [ordenacao, setOrdenacao] = useState<Ordenacao>("relevancia");

	function toggleCategoria(slug: string) {
		setCategoriasSel((atual) =>
			atual.includes(slug) ? atual.filter((s) => s !== slug) : [...atual, slug],
		);
	}

	const resultado = useMemo(() => {
		let lista = maquinas.filter((m) => {
			if (categoriasSel.length && !categoriasSel.includes(m.categoriaSlug)) return false;
			if (m.precoDia > precoMax) return false;
			if (somenteDisponiveis && !m.disponivel) return false;
			if (busca.trim()) {
				const termo = busca.trim().toLowerCase();
				const alvo = `${m.nome} ${m.categoriaNome} ${m.cidade}`.toLowerCase();
				if (!alvo.includes(termo)) return false;
			}
			return true;
		});

		lista = [...lista].sort((a, b) => {
			if (ordenacao === "menor") return a.precoDia - b.precoDia;
			if (ordenacao === "maior") return b.precoDia - a.precoDia;
			if (ordenacao === "avaliadas") return b.nota - a.nota;
			return 0;
		});

		return lista;
	}, [busca, categoriasSel, precoMax, somenteDisponiveis, ordenacao]);

	const filtrosProps = {
		categoriasSel,
		toggleCategoria,
		precoMax,
		setPrecoMax,
		somenteDisponiveis,
		setSomenteDisponiveis,
	};

	return (
		<div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
			<header className="mb-8">
				<h1 className="text-3xl font-extrabold tracking-tight text-foreground">
					Máquinas para alugar
				</h1>
				<p className="mt-1 text-muted-foreground">
					Equipamentos de construção e ferramentas perto de você.
				</p>
			</header>

			<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
				<Input
					value={busca}
					onChange={(e) => setBusca(e.target.value)}
					placeholder="Buscar por nome, categoria ou cidade"
					className="sm:max-w-sm"
				/>
				<div className="flex items-center gap-3 sm:ml-auto">
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="outline" className="lg:hidden">
								<SlidersHorizontal className="size-4" />
								Filtros
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="w-80 overflow-y-auto">
							<SheetHeader>
								<SheetTitle>Filtros</SheetTitle>
							</SheetHeader>
							<div className="px-4 pb-8">
								<Filtros {...filtrosProps} />
							</div>
						</SheetContent>
					</Sheet>

					<Select value={ordenacao} onValueChange={(v) => setOrdenacao(v as Ordenacao)}>
						<SelectTrigger className="w-[190px]">
							<SelectValue placeholder="Ordenar" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="relevancia">Relevância</SelectItem>
							<SelectItem value="menor">Menor preço</SelectItem>
							<SelectItem value="maior">Maior preço</SelectItem>
							<SelectItem value="avaliadas">Melhor avaliadas</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="grid gap-8 lg:grid-cols-[240px_1fr]">
				<aside className="hidden lg:block">
					<div className="sticky top-24 rounded-xl border border-border bg-card p-5">
						<Filtros {...filtrosProps} />
					</div>
				</aside>

				<div>
					<p className="mb-4 text-sm text-muted-foreground">
						{resultado.length}{" "}
						{resultado.length === 1 ? "máquina encontrada" : "máquinas encontradas"}
					</p>

					{resultado.length === 0 ? (
						<div className="rounded-xl border border-dashed border-border p-12 text-center">
							<p className="font-medium text-foreground">Nenhuma máquina encontrada.</p>
							<p className="mt-1 text-sm text-muted-foreground">
								Ajuste os filtros ou amplie a faixa de preço.
							</p>
						</div>
					) : (
						<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
							{resultado.map((maquina) => (
								<MachineCard key={maquina.id} maquina={maquina} />
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
