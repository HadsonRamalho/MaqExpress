"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CreditCard, FileText, QrCode, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ContratoLocacao } from "@/components/marketplace/contrato-locacao";
import { COMISSAO_PERCENT, formatarBRL } from "@/lib/mock-data";
import { registrarPagamento, useSolicitacao } from "@/lib/solicitacoes-store";

export default function PagamentoPage() {
	const { id } = useParams<{ id: string }>();
	const router = useRouter();
	const solicitacao = useSolicitacao(id);

	const [aceito, setAceito] = useState(false);
	const [metodo, setMetodo] = useState("pix");
	const [processando, setProcessando] = useState(false);

	if (!solicitacao) {
		return (
			<EstadoVazio
				titulo="Solicitação não encontrada"
				texto="Esse pedido não existe ou foi removido."
			/>
		);
	}

	if (solicitacao.status === "paga" || solicitacao.status === "concluida") {
		return (
			<EstadoVazio
				titulo="Pagamento já realizado"
				texto="Essa locação já está paga. Acompanhe os detalhes em Meus aluguéis."
			/>
		);
	}

	if (solicitacao.status !== "aceita") {
		return (
			<EstadoVazio
				titulo="Pagamento indisponível"
				texto={
					solicitacao.status === "pendente"
						? "O locador ainda não aceitou esta solicitação."
						: "Esta solicitação foi recusada pelo locador."
				}
			/>
		);
	}

	async function pagar() {
		if (!solicitacao || !aceito) return;
		setProcessando(true);
		// Checkout real (Mercado Pago + split) entra quando o backend de pagamentos existir.
		await new Promise((r) => setTimeout(r, 900));
		registrarPagamento(solicitacao.id);
		setProcessando(false);
		toast.success("Pagamento confirmado! Contrato aceito.");
		router.push(`/meus-alugueis/${solicitacao.id}`);
	}

	return (
		<div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
			<h1 className="text-2xl font-extrabold tracking-tight text-foreground">
				Pagamento e contrato
			</h1>
			<p className="mt-1 text-muted-foreground">
				Revise o contrato, aceite os termos e conclua o pagamento com segurança.
			</p>

			<div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
				<div className="space-y-8">
					<section>
						<h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
							<FileText className="size-4 text-primary" />
							Contrato de locação
						</h2>
						<div className="mt-3 max-h-64 overflow-y-auto rounded-xl border border-border bg-muted/30 p-4">
							<ContratoLocacao solicitacao={solicitacao} />
						</div>
						<div className="mt-3 flex items-start gap-3">
							<Checkbox
								id="aceite"
								checked={aceito}
								onCheckedChange={(v) => setAceito(v === true)}
								className="mt-0.5"
							/>
							<Label
								htmlFor="aceite"
								className="text-sm font-normal leading-relaxed text-foreground"
							>
								Li e aceito os termos do contrato de locação e autorizo a cobrança de{" "}
								{formatarBRL(solicitacao.total)}.
							</Label>
						</div>
					</section>

					<Separator />

					<section>
						<h2 className="text-sm font-semibold text-foreground">Forma de pagamento</h2>
						<RadioGroup value={metodo} onValueChange={setMetodo} className="mt-3 space-y-3">
							<Label
								htmlFor="pix"
								className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-4 font-normal has-[:checked]:border-primary has-[:checked]:bg-primary/5"
							>
								<RadioGroupItem value="pix" id="pix" />
								<QrCode className="size-5 text-muted-foreground" />
								<span className="text-sm text-foreground">Pix (aprovação imediata)</span>
							</Label>
							<Label
								htmlFor="cartao"
								className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-4 font-normal has-[:checked]:border-primary has-[:checked]:bg-primary/5"
							>
								<RadioGroupItem value="cartao" id="cartao" />
								<CreditCard className="size-5 text-muted-foreground" />
								<span className="text-sm text-foreground">Cartão de crédito</span>
							</Label>
						</RadioGroup>
					</section>
				</div>

				<aside>
					<div className="lg:sticky lg:top-24">
						<div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
							<h2 className="font-bold text-foreground">Resumo</h2>
							<p className="mt-1 text-sm text-muted-foreground">{solicitacao.maquinaNome}</p>

							<dl className="mt-4 space-y-2 text-sm">
								<div className="flex justify-between">
									<dt className="text-muted-foreground">Subtotal ({solicitacao.dias} diárias)</dt>
									<dd className="text-foreground">{formatarBRL(solicitacao.subtotal)}</dd>
								</div>
								<div className="flex justify-between">
									<dt className="text-muted-foreground">Taxa de serviço ({COMISSAO_PERCENT}%)</dt>
									<dd className="text-foreground">{formatarBRL(solicitacao.taxa)}</dd>
								</div>
								<div className="flex justify-between">
									<dt className="text-muted-foreground">
										Frete {solicitacao.tipoEntrega === "entrega" ? "(entrega)" : "(retirada)"}
									</dt>
									<dd className="text-foreground">
										{solicitacao.frete > 0 ? formatarBRL(solicitacao.frete) : "Grátis"}
									</dd>
								</div>
								<div className="flex justify-between border-t border-border pt-2 text-base font-bold">
									<dt className="text-foreground">Total</dt>
									<dd className="text-foreground">{formatarBRL(solicitacao.total)}</dd>
								</div>
							</dl>

							<Button
								className="mt-5 w-full"
								size="lg"
								disabled={!aceito || processando}
								onClick={pagar}
							>
								{processando ? "Processando..." : `Pagar ${formatarBRL(solicitacao.total)}`}
							</Button>
							{!aceito && (
								<p className="mt-2 text-center text-xs text-muted-foreground">
									Aceite o contrato para liberar o pagamento.
								</p>
							)}
							<p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
								<ShieldCheck className="size-3.5 text-primary" />
								Pagamento protegido pela plataforma
							</p>
						</div>
					</div>
				</aside>
			</div>
		</div>
	);
}

function EstadoVazio({ titulo, texto }: { titulo: string; texto: string }) {
	return (
		<div className="mx-auto max-w-md px-4 py-16 text-center">
			<h1 className="text-xl font-bold text-foreground">{titulo}</h1>
			<p className="mt-2 text-muted-foreground">{texto}</p>
			<Button asChild className="mt-6">
				<Link href="/meus-alugueis">Ir para Meus aluguéis</Link>
			</Button>
		</div>
	);
}
