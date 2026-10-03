"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleButton } from "@/components/auth/google-button";

export default function LoginPage() {
	const router = useRouter();
	const { login } = useAuth();
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [enviando, setEnviando] = useState(false);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setEnviando(true);
		try {
			await login({ email, senha });
			toast.success("Bem-vindo de volta!");
			router.push("/");
		} catch {
			toast.error("E-mail ou senha incorretos.");
		} finally {
			setEnviando(false);
		}
	}

	return (
		<div>
			<h1 className="text-2xl font-bold tracking-tight text-foreground">
				Entrar
			</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				Acesse sua conta para alugar ou gerenciar suas máquinas.
			</p>

			<form onSubmit={onSubmit} className="mt-8 space-y-4">
				<div className="space-y-2">
					<Label htmlFor="email">E-mail</Label>
					<Input
						id="email"
						type="email"
						autoComplete="email"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="voce@email.com"
					/>
				</div>

				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<Label htmlFor="senha">Senha</Label>
						<Link
							href="/recuperar-senha"
							className="text-sm text-primary hover:underline"
						>
							Esqueci a senha
						</Link>
					</div>
					<Input
						id="senha"
						type="password"
						autoComplete="current-password"
						required
						value={senha}
						onChange={(e) => setSenha(e.target.value)}
						placeholder="Sua senha"
					/>
				</div>

				<Button type="submit" className="w-full" size="lg" disabled={enviando}>
					{enviando ? "Entrando..." : "Entrar"}
				</Button>
			</form>

			<div className="my-6 flex items-center gap-3 text-sm text-muted-foreground">
				<span className="h-px flex-1 bg-border" />
				ou
				<span className="h-px flex-1 bg-border" />
			</div>

			<GoogleButton label="Continuar com Google" />

			<p className="mt-8 text-center text-sm text-muted-foreground">
				Ainda não tem conta?{" "}
				<Link href="/cadastro" className="font-medium text-primary hover:underline">
					Criar conta
				</Link>
			</p>
		</div>
	);
}
