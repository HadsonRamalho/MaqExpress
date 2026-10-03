"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function iniciais(nome?: string) {
	if (!nome) return "?";
	return nome
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((p) => p[0]?.toUpperCase())
		.join("");
}

export default function PerfilPage() {
	const { user, updateProfile } = useAuth();
	const [nome, setNome] = useState(user?.nome ?? "");
	const [email, setEmail] = useState(user?.email ?? "");
	const [salvando, setSalvando] = useState(false);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSalvando(true);
		try {
			await updateProfile({ nome, email });
			toast.success("Perfil atualizado.");
		} catch {
			toast.error("Não foi possível salvar. Tente novamente.");
		} finally {
			setSalvando(false);
		}
	}

	return (
		<div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
			<h1 className="text-2xl font-extrabold tracking-tight text-foreground">Perfil</h1>
			<p className="mt-1 text-muted-foreground">Seus dados de conta e contato.</p>

			<div className="mt-8 flex items-center gap-4">
				<Avatar className="size-16">
					<AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
						{iniciais(user?.nome)}
					</AvatarFallback>
				</Avatar>
				<div>
					<p className="font-semibold text-foreground">{user?.nome ?? "—"}</p>
					<p className="text-sm text-muted-foreground">{user?.email ?? "—"}</p>
				</div>
			</div>

			<form
				onSubmit={onSubmit}
				className="mt-8 space-y-5 rounded-xl border border-border bg-card p-6"
			>
				<div className="space-y-2">
					<Label htmlFor="nome">Nome completo</Label>
					<Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
				</div>

				<div className="space-y-2">
					<Label htmlFor="email">E-mail</Label>
					<Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
				</div>

				<div className="space-y-2">
					<Label htmlFor="cpf">CPF</Label>
					<Input id="cpf" value={user?.cpf ?? ""} disabled readOnly />
					<p className="text-xs text-muted-foreground">O CPF não pode ser alterado por aqui.</p>
				</div>

				<Button type="submit" disabled={salvando}>
					{salvando ? "Salvando..." : "Salvar alterações"}
				</Button>
			</form>
		</div>
	);
}
