import Link from "next/link";
import { MaqExpressLogo } from "@/components/layout/logo";

const colunas = [
	{
		titulo: "Explorar",
		links: [
			{ href: "/maquinas", label: "Todas as máquinas" },
			{ href: "/maquinas?categoria=escavadeiras", label: "Escavadeiras" },
			{ href: "/maquinas?categoria=caminhoes", label: "Caminhões" },
			{ href: "/maquinas?categoria=ferramentas", label: "Ferramentas" },
		],
	},
	{
		titulo: "Para locadores",
		links: [
			{ href: "/cadastrar-maquina", label: "Anunciar máquina" },
			{ href: "/minhas-maquinas", label: "Meu painel" },
			{ href: "/como-funciona", label: "Como funciona" },
		],
	},
	{
		titulo: "Empresa",
		links: [
			{ href: "/sobre-nos", label: "Sobre nós" },
			{ href: "/contratos", label: "Contratos" },
		],
	},
];

export function SiteFooter() {
	return (
		<footer className="border-t border-border/70 bg-muted/30">
			<div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
				<div className="max-w-xs">
					<MaqExpressLogo />
					<p className="mt-4 text-sm leading-relaxed text-muted-foreground">
						Alugue a máquina certa para sua obra, direto com quem tem. Busca simples, contrato
						digital e pagamento seguro.
					</p>
				</div>

				{colunas.map((coluna) => (
					<div key={coluna.titulo}>
						<h3 className="text-sm font-semibold text-foreground">{coluna.titulo}</h3>
						<ul className="mt-4 space-y-3">
							{coluna.links.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground transition-colors hover:text-foreground"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>

			<div className="border-t border-border/70">
				<div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
					<p>© {new Date().getFullYear()} MaqExpress. Todos os direitos reservados.</p>
					<p>Feito para quem move a obra.</p>
				</div>
			</div>
		</footer>
	);
}
