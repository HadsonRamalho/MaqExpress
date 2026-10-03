"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, LogOut, Menu, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MaqExpressLogo } from "@/components/layout/logo";

const navLinks = [
	{ href: "/maquinas", label: "Máquinas" },
	{ href: "/como-funciona", label: "Como funciona" },
	{ href: "/sobre-nos", label: "Sobre nós" },
];

function iniciais(nome?: string) {
	if (!nome) return "?";
	return nome
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((p) => p[0]?.toUpperCase())
		.join("");
}

function MenuUsuario() {
	const { user, logout } = useAuth();
	const router = useRouter();

	if (!user) {
		return (
			<Button asChild variant="ghost">
				<Link href="/login">Entrar</Link>
			</Button>
		);
	}

	function sair() {
		logout();
		router.push("/");
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="flex items-center gap-2 rounded-full p-1 pr-3 transition-colors hover:bg-muted"
				>
					<Avatar className="size-8">
						<AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
							{iniciais(user.nome)}
						</AvatarFallback>
					</Avatar>
					<span className="max-w-28 truncate text-sm font-medium text-foreground">
						{user.nome?.split(" ")[0] ?? "Conta"}
					</span>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-52">
				<DropdownMenuLabel className="truncate font-normal text-muted-foreground">
					{user.email}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href="/minhas-maquinas">
						<LayoutDashboard className="size-4" />
						Meu painel
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href="/perfil">
						<User className="size-4" />
						Perfil
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onSelect={sair}>
					<LogOut className="size-4" />
					Sair
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function SiteHeader() {
	const pathname = usePathname();
	const { user } = useAuth();
	const [open, setOpen] = useState(false);

	return (
		<header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
			<div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
				<Link href="/" className="shrink-0" aria-label="MaqExpress, página inicial">
					<MaqExpressLogo />
				</Link>

				<nav className="hidden items-center gap-1 md:flex">
					{navLinks.map((link) => {
						const active = pathname.startsWith(link.href);
						return (
							<Link
								key={link.href}
								href={link.href}
								className={cn(
									"rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
									active && "text-foreground",
								)}
							>
								{link.label}
							</Link>
						);
					})}
				</nav>

				<div className="ml-auto hidden items-center gap-2 md:flex">
					<MenuUsuario />
					<Button asChild>
						<Link href="/cadastrar-maquina">Anunciar máquina</Link>
					</Button>
				</div>

				<Sheet open={open} onOpenChange={setOpen}>
					<SheetTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="ml-auto md:hidden"
							aria-label="Abrir menu"
						>
							<Menu className="size-5" />
						</Button>
					</SheetTrigger>
					<SheetContent side="right" className="w-72">
						<SheetHeader>
							<SheetTitle className="text-left">
								<MaqExpressLogo />
							</SheetTitle>
						</SheetHeader>
						<nav className="mt-6 flex flex-col gap-1 px-4">
							{navLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									onClick={() => setOpen(false)}
									className="rounded-md px-3 py-2.5 text-base font-medium text-foreground hover:bg-muted"
								>
									{link.label}
								</Link>
							))}
						</nav>
						<div className="mt-6 flex flex-col gap-2 px-4">
							<Button asChild variant="outline" onClick={() => setOpen(false)}>
								<Link href={user ? "/minhas-maquinas" : "/login"}>
									{user ? "Meu painel" : "Entrar"}
								</Link>
							</Button>
							<Button asChild onClick={() => setOpen(false)}>
								<Link href="/cadastrar-maquina">Anunciar máquina</Link>
							</Button>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</header>
	);
}
