"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSearch() {
	const router = useRouter();
	const [busca, setBusca] = useState("");
	const [cidade, setCidade] = useState("");

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		const params = new URLSearchParams();
		if (busca.trim()) params.set("busca", busca.trim());
		if (cidade.trim()) params.set("cidade", cidade.trim());
		router.push(`/maquinas${params.toString() ? `?${params}` : ""}`);
	}

	return (
		<form
			onSubmit={onSubmit}
			className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm sm:flex-row sm:items-center sm:rounded-full sm:p-1.5"
		>
			<div className="flex flex-1 items-center gap-2 px-3">
				<Search className="size-5 shrink-0 text-muted-foreground" />
				<Input
					value={busca}
					onChange={(e) => setBusca(e.target.value)}
					placeholder="O que você precisa alugar?"
					className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
					aria-label="O que você precisa alugar"
				/>
			</div>
			<div className="hidden w-px self-stretch bg-border sm:block" />
			<div className="flex flex-1 items-center gap-2 px-3">
				<MapPin className="size-5 shrink-0 text-muted-foreground" />
				<Input
					value={cidade}
					onChange={(e) => setCidade(e.target.value)}
					placeholder="Cidade"
					className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
					aria-label="Cidade"
				/>
			</div>
			<Button type="submit" size="lg" className="rounded-full sm:px-8">
				Buscar
			</Button>
		</form>
	);
}
