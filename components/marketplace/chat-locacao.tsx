"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { type AutorMensagem, enviarMensagem, type Mensagem } from "@/lib/solicitacoes-store";

function formatarHora(iso: string) {
	return new Date(iso).toLocaleString("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function ChatLocacao({
	solicitacaoId,
	mensagens,
	autorAtual = "locatario",
	nomeLocador,
}: {
	solicitacaoId: string;
	mensagens: Mensagem[];
	autorAtual?: AutorMensagem;
	nomeLocador: string;
}) {
	const [texto, setTexto] = useState("");

	function enviar(e: React.FormEvent) {
		e.preventDefault();
		if (!texto.trim()) return;
		enviarMensagem(solicitacaoId, autorAtual, texto);
		setTexto("");
	}

	return (
		<div className="flex flex-col rounded-xl border border-border bg-card">
			<div className="flex max-h-80 flex-col gap-3 overflow-y-auto p-4">
				{mensagens.map((m) => {
					const meu = m.autor === autorAtual;
					return (
						<div key={m.id} className={cn("flex flex-col", meu ? "items-end" : "items-start")}>
							<div
								className={cn(
									"max-w-[80%] rounded-2xl px-3.5 py-2 text-sm",
									meu
										? "rounded-br-sm bg-primary text-primary-foreground"
										: "rounded-bl-sm bg-muted text-foreground",
								)}
							>
								{m.texto}
							</div>
							<span className="mt-1 px-1 text-[11px] text-muted-foreground">
								{meu ? "Você" : nomeLocador} · {formatarHora(m.em)}
							</span>
						</div>
					);
				})}
			</div>

			<form onSubmit={enviar} className="flex gap-2 border-t border-border p-3">
				<Input
					value={texto}
					onChange={(e) => setTexto(e.target.value)}
					placeholder="Escreva uma mensagem…"
					aria-label="Mensagem"
				/>
				<Button type="submit" size="icon" disabled={!texto.trim()} aria-label="Enviar">
					<Send className="size-4" />
				</Button>
			</form>
		</div>
	);
}
