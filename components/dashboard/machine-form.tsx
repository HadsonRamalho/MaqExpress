"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { categorias, type MaquinaMock } from "@/lib/mock-data";

export function MachineForm({ maquina }: { maquina?: MaquinaMock }) {
	const router = useRouter();
	const edicao = Boolean(maquina);
	const [enviando, setEnviando] = useState(false);
	const [form, setForm] = useState({
		nome: maquina?.nome ?? "",
		categoria: maquina?.categoriaSlug ?? "",
		descricao: maquina?.descricao ?? "",
		cidade: maquina?.cidade ?? "",
		uf: maquina?.uf ?? "",
		precoDia: maquina?.precoDia?.toString() ?? "",
		precoSemana: maquina?.precoSemana?.toString() ?? "",
		precoMes: "",
		disponivel: maquina?.disponivel ?? true,
	});

	function set<K extends keyof typeof form>(campo: K, valor: (typeof form)[K]) {
		setForm((atual) => ({ ...atual, [campo]: valor }));
	}

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setEnviando(true);
		// Persistência real via services/maquina entra quando o backend tiver preço e imagens.
		await new Promise((r) => setTimeout(r, 700));
		setEnviando(false);
		toast.success(edicao ? "Anúncio atualizado." : "Máquina anunciada!");
		router.push("/minhas-maquinas");
	}

	return (
		<form onSubmit={onSubmit} className="space-y-8">
			<section className="space-y-4">
				<h2 className="text-sm font-semibold text-foreground">Dados da máquina</h2>

				<div className="space-y-2">
					<Label htmlFor="nome">Nome</Label>
					<Input
						id="nome"
						required
						value={form.nome}
						onChange={(e) => set("nome", e.target.value)}
						placeholder="Ex.: Escavadeira hidráulica CAT 320"
					/>
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="categoria">Categoria</Label>
						<Select value={form.categoria} onValueChange={(v) => set("categoria", v)}>
							<SelectTrigger id="categoria">
								<SelectValue placeholder="Selecione" />
							</SelectTrigger>
							<SelectContent>
								{categorias.map((c) => (
									<SelectItem key={c.slug} value={c.slug}>
										{c.nome}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="grid grid-cols-[1fr_80px] gap-3">
						<div className="space-y-2">
							<Label htmlFor="cidade">Cidade</Label>
							<Input
								id="cidade"
								required
								value={form.cidade}
								onChange={(e) => set("cidade", e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="uf">UF</Label>
							<Input
								id="uf"
								required
								maxLength={2}
								value={form.uf}
								onChange={(e) => set("uf", e.target.value.toUpperCase())}
							/>
						</div>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="descricao">Descrição</Label>
					<Textarea
						id="descricao"
						rows={4}
						value={form.descricao}
						onChange={(e) => set("descricao", e.target.value)}
						placeholder="Capacidade, horas de uso, acessórios inclusos, condições de uso..."
					/>
				</div>
			</section>

			<section className="space-y-4">
				<h2 className="text-sm font-semibold text-foreground">Preços</h2>
				<div className="grid gap-4 sm:grid-cols-3">
					<div className="space-y-2">
						<Label htmlFor="precoDia">Diária (R$)</Label>
						<Input
							id="precoDia"
							required
							inputMode="numeric"
							value={form.precoDia}
							onChange={(e) => set("precoDia", e.target.value)}
							placeholder="0"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="precoSemana">Semana (R$)</Label>
						<Input
							id="precoSemana"
							inputMode="numeric"
							value={form.precoSemana}
							onChange={(e) => set("precoSemana", e.target.value)}
							placeholder="Opcional"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="precoMes">Mês (R$)</Label>
						<Input
							id="precoMes"
							inputMode="numeric"
							value={form.precoMes}
							onChange={(e) => set("precoMes", e.target.value)}
							placeholder="Opcional"
						/>
					</div>
				</div>
			</section>

			<section className="space-y-4">
				<h2 className="text-sm font-semibold text-foreground">Fotos</h2>
				<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
					<ImagePlus className="size-7 text-muted-foreground" />
					<p className="mt-2 text-sm font-medium text-foreground">
						Arraste fotos ou clique para enviar
					</p>
					<p className="mt-1 text-xs text-muted-foreground">
						O envio de imagens será ligado junto com o armazenamento (Supabase).
					</p>
				</div>
			</section>

			<section className="flex items-center justify-between rounded-xl border border-border p-4">
				<div>
					<Label htmlFor="disponivel" className="text-sm font-medium">
						Disponível para aluguel
					</Label>
					<p className="text-sm text-muted-foreground">
						Desligue para pausar o anúncio sem apagá-lo.
					</p>
				</div>
				<Switch
					id="disponivel"
					checked={form.disponivel}
					onCheckedChange={(v) => set("disponivel", v)}
				/>
			</section>

			<div className="flex gap-3">
				<Button type="submit" size="lg" disabled={enviando}>
					{enviando ? "Salvando..." : edicao ? "Salvar alterações" : "Publicar anúncio"}
				</Button>
				<Button
					type="button"
					variant="outline"
					size="lg"
					onClick={() => router.push("/minhas-maquinas")}
				>
					Cancelar
				</Button>
			</div>
		</form>
	);
}
