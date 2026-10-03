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

export default function CadastroPage() {
	const router = useRouter();
	const { register } = useAuth();
	const [form, setForm] = useState({
		nome: "",
		cpf: "",
		email: "",
		senha: "",
		confirmar: "",
	});
	const [enviando, setEnviando] = useState(false);

	function set(campo: keyof typeof form, valor: string) {
		setForm((atual) => ({ ...atual, [campo]: valor }));
	}

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (form.senha !== form.confirmar) {
			toast.error("As senhas não conferem.");
			return;
		}
		if (form.senha.length < 8) {
			toast.error("A senha precisa ter ao menos 8 caracteres.");
			return;
		}
		setEnviando(true);
		try {
			await register({
				nome: form.nome,
				cpf: form.cpf,
				email: form.email,
				senha: form.senha,
				tipo_login: "email",
			});
			toast.success("Conta criada! Faça login para continuar.");
			router.push("/login");
		} catch {
			toast.error("Não foi possível criar a conta. Tente novamente.");
		} finally {
			setEnviando(false);
		}
	}

	return (
		<div>
			<h1 className="text-2xl font-bold tracking-tight text-foreground">
				Criar conta
			</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				Leva menos de um minuto. Depois é só alugar ou anunciar.
			</p>

			<form onSubmit={onSubmit} className="mt-8 space-y-4">
				<div className="space-y-2">
					<Label htmlFor="nome">Nome completo</Label>
					<Input
						id="nome"
						required
						value={form.nome}
						onChange={(e) => set("nome", e.target.value)}
						placeholder="Como devemos te chamar"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="cpf">CPF</Label>
					<Input
						id="cpf"
						required
						inputMode="numeric"
						value={form.cpf}
						onChange={(e) => set("cpf", e.target.value)}
						placeholder="Somente números"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="email">E-mail</Label>
					<Input
						id="email"
						type="email"
						autoComplete="email"
						required
						value={form.email}
						onChange={(e) => set("email", e.target.value)}
						placeholder="voce@email.com"
					/>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="senha">Senha</Label>
						<Input
							id="senha"
							type="password"
							autoComplete="new-password"
							required
							value={form.senha}
							onChange={(e) => set("senha", e.target.value)}
							placeholder="Mín. 8 caracteres"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="confirmar">Confirmar senha</Label>
						<Input
							id="confirmar"
							type="password"
							autoComplete="new-password"
							required
							value={form.confirmar}
							onChange={(e) => set("confirmar", e.target.value)}
							placeholder="Repita a senha"
						/>
					</div>
				</div>

				<Button type="submit" className="w-full" size="lg" disabled={enviando}>
					{enviando ? "Criando conta..." : "Criar conta"}
				</Button>
			</form>

			<div className="my-6 flex items-center gap-3 text-sm text-muted-foreground">
				<span className="h-px flex-1 bg-border" />
				ou
				<span className="h-px flex-1 bg-border" />
			</div>

			<GoogleButton label="Cadastrar com Google" />

			<p className="mt-8 text-center text-sm text-muted-foreground">
				Já tem conta?{" "}
				<Link href="/login" className="font-medium text-primary hover:underline">
					Entrar
				</Link>
			</p>
		</div>
	);
}
