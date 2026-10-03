import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { MaqExpressLogo } from "@/components/layout/logo";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="grid min-h-dvh lg:grid-cols-2">
			{/* Painel de marca (desktop) */}
			<div className="relative hidden lg:block">
				<Image
					src="/construction-site.png"
					alt=""
					fill
					sizes="50vw"
					className="object-cover"
					priority
				/>
				<div className="absolute inset-0 bg-primary/70 mix-blend-multiply" />
				<div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
					<Link href="/" className="w-fit">
						<span className="flex items-center gap-2 text-lg font-extrabold">
							<span className="rounded-md bg-background/15 px-2 py-1">Maq</span>
							Express
						</span>
					</Link>
					<div>
						<p className="max-w-md text-balance text-3xl font-bold leading-tight">
							A máquina certa, no dia certo, direto com quem tem.
						</p>
						<p className="mt-3 max-w-md text-primary-foreground/80">
							Entre para alugar equipamentos ou colocar os seus para render.
						</p>
					</div>
				</div>
			</div>

			{/* Conteúdo */}
			<div className="flex flex-col">
				<div className="p-6 lg:hidden">
					<Link href="/" className="w-fit">
						<MaqExpressLogo />
					</Link>
				</div>
				<div className="flex flex-1 items-center justify-center px-6 pb-12">
					<div className="w-full max-w-sm">{children}</div>
				</div>
			</div>
		</div>
	);
}
