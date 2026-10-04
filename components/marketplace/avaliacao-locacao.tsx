"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { type Avaliacao, avaliarLocacao } from "@/lib/solicitacoes-store";

function Estrelas({ nota, tamanho = "size-5" }: { nota: number; tamanho?: string }) {
	return (
		<div className="flex gap-0.5">
			{[1, 2, 3, 4, 5].map((n) => (
				<Star
					key={n}
					className={cn(
						tamanho,
						n <= nota ? "fill-primary text-primary" : "text-muted-foreground/40",
					)}
				/>
			))}
		</div>
	);
}

export function AvaliacaoLocacao({
	solicitacaoId,
	avaliacao,
	locador,
}: {
	solicitacaoId: string;
	avaliacao?: Avaliacao;
	locador: string;
}) {
	const [nota, setNota] = useState(0);
	const [hover, setHover] = useState(0);
	const [comentario, setComentario] = useState("");
	const [enviando, setEnviando] = useState(false);

	if (avaliacao) {
		return (
			<div className="rounded-xl border border-border bg-card p-4">
				<div className="flex items-center gap-2">
					<Estrelas nota={avaliacao.nota} />
					<span className="text-sm font-medium text-foreground">{avaliacao.nota}/5</span>
				</div>
				{avaliacao.comentario && (
					<p className="mt-2 text-sm text-muted-foreground">“{avaliacao.comentario}”</p>
				)}
				<p className="mt-2 text-xs text-muted-foreground">Obrigado por avaliar a {locador}!</p>
			</div>
		);
	}

	async function enviar() {
		if (nota < 1) {
			toast.error("Escolha de 1 a 5 estrelas.");
			return;
		}
		setEnviando(true);
		await new Promise((r) => setTimeout(r, 400));
		avaliarLocacao(solicitacaoId, nota, comentario);
		setEnviando(false);
		toast.success("Avaliação registrada. Obrigado!");
	}

	return (
		<div className="rounded-xl border border-border bg-card p-4">
			<p className="text-sm font-medium text-foreground">Como foi sua experiência?</p>
			<div className="mt-3 flex gap-1">
				{[1, 2, 3, 4, 5].map((n) => (
					<button
						key={n}
						type="button"
						aria-label={`${n} ${n === 1 ? "estrela" : "estrelas"}`}
						onClick={() => setNota(n)}
						onMouseEnter={() => setHover(n)}
						onMouseLeave={() => setHover(0)}
						className="p-0.5"
					>
						<Star
							className={cn(
								"size-7 transition-colors",
								n <= (hover || nota) ? "fill-primary text-primary" : "text-muted-foreground/40",
							)}
						/>
					</button>
				))}
			</div>
			<Textarea
				className="mt-3"
				rows={3}
				value={comentario}
				onChange={(e) => setComentario(e.target.value)}
				placeholder="Conte como foi o equipamento, o atendimento e a entrega (opcional)."
			/>
			<Button className="mt-3" onClick={enviar} disabled={enviando}>
				{enviando ? "Enviando..." : "Enviar avaliação"}
			</Button>
		</div>
	);
}
