import Link from "next/link";
import { CalendarCheck, FileCheck2, Search, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

const passosLocatario = [
	{
		icon: Search,
		titulo: "Encontre a máquina",
		texto: "Busque por categoria, cidade e o período que você precisa.",
	},
	{
		icon: CalendarCheck,
		titulo: "Solicite as datas",
		texto: "Escolha início e fim e envie a solicitação direto ao locador.",
	},
	{
		icon: FileCheck2,
		titulo: "Assine e retire",
		texto: "Pague com segurança, assine o contrato digital e combine a retirada.",
	},
];

export default function ComoFuncionaPage() {
	return (
		<div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
			<h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
				Como funciona
			</h1>
			<p className="mt-3 max-w-2xl text-lg text-muted-foreground">
				Alugar equipamento não precisa ter burocracia. Veja o caminho do pedido à retirada.
			</p>

			<section className="mt-12">
				<h2 className="text-xl font-bold text-foreground">Para quem aluga</h2>
				<ol className="mt-6 grid gap-8 sm:grid-cols-3">
					{passosLocatario.map((passo, i) => {
						const Icon = passo.icon;
						return (
							<li key={passo.titulo}>
								<div className="flex items-center gap-3">
									<span className="flex size-9 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
										{i + 1}
									</span>
									<Icon className="size-5 text-primary" />
								</div>
								<h3 className="mt-3 font-semibold text-foreground">{passo.titulo}</h3>
								<p className="mt-1 text-sm leading-relaxed text-muted-foreground">{passo.texto}</p>
							</li>
						);
					})}
				</ol>
			</section>

			<section className="mt-14 rounded-2xl border border-border bg-muted/30 p-8">
				<div className="flex items-start gap-3">
					<Wallet className="mt-1 size-6 shrink-0 text-primary" />
					<div>
						<h2 className="text-xl font-bold text-foreground">Para quem tem máquina</h2>
						<p className="mt-2 max-w-2xl text-muted-foreground">
							Anuncie em minutos, defina preço e disponibilidade e receba as solicitações no seu
							painel. A gente cuida do contrato e do repasse do pagamento, descontando apenas a
							comissão.
						</p>
						<Button asChild className="mt-5">
							<Link href="/cadastrar-maquina">Anunciar máquina</Link>
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
}
