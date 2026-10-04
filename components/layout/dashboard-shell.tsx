"use client";

import type React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Inbox, LogOut, Menu, Package, PlusCircle, Tractor, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MaqExpressLogo } from "@/components/layout/logo";

const itens = [
	{ href: "/meus-alugueis", label: "Meus aluguéis", icon: Package },
	{ href: "/minhas-maquinas", label: "Minhas máquinas", icon: Tractor },
	{ href: "/solicitacoes", label: "Solicitações", icon: Inbox },
	{ href: "/cadastrar-maquina", label: "Anunciar máquina", icon: PlusCircle },
	{ href: "/perfil", label: "Perfil", icon: User },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
	const pathname = usePathname();
	const { logout } = useAuth();
	const router = useRouter();

	function sair() {
		logout();
		router.push("/");
	}

	return (
		<div className="flex h-full flex-col">
			<div className="px-5 py-5">
				<Link href="/" onClick={onNavigate}>
					<MaqExpressLogo />
				</Link>
			</div>
			<nav className="flex-1 space-y-1 px-3">
				{itens.map((item) => {
					const Icon = item.icon;
					const ativo = pathname.startsWith(item.href);
					return (
						<Link
							key={item.href}
							href={item.href}
							onClick={onNavigate}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
								ativo
									? "bg-primary/10 text-primary"
									: "text-muted-foreground hover:bg-muted hover:text-foreground",
							)}
						>
							<Icon className="size-5" />
							{item.label}
						</Link>
					);
				})}
			</nav>
			<div className="space-y-1 border-t border-border p-3">
				<Link
					href="/"
					onClick={onNavigate}
					className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
				>
					<ArrowLeft className="size-5" />
					Voltar ao site
				</Link>
				<button
					type="button"
					onClick={sair}
					className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
				>
					<LogOut className="size-5" />
					Sair
				</button>
			</div>
		</div>
	);
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
	const { user, isLoading } = useAuth();
	const router = useRouter();
	const [menuAberto, setMenuAberto] = useState(false);

	useEffect(() => {
		if (!isLoading && !user) router.replace("/login");
	}, [isLoading, user, router]);

	if (isLoading || !user) {
		return (
			<div className="flex min-h-dvh items-center justify-center text-muted-foreground">
				Carregando...
			</div>
		);
	}

	return (
		<div className="flex min-h-dvh">
			<aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:block">
				<div className="sticky top-0 h-dvh">
					<SidebarNav />
				</div>
			</aside>

			<div className="flex min-w-0 flex-1 flex-col">
				<header className="flex h-16 items-center gap-3 border-b border-border px-4 lg:hidden">
					<Sheet open={menuAberto} onOpenChange={setMenuAberto}>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" aria-label="Abrir menu">
								<Menu className="size-5" />
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="w-64 p-0">
							<SidebarNav onNavigate={() => setMenuAberto(false)} />
						</SheetContent>
					</Sheet>
					<Link href="/">
						<MaqExpressLogo />
					</Link>
				</header>

				<main className="flex-1 bg-muted/20">{children}</main>
			</div>
		</div>
	);
}
