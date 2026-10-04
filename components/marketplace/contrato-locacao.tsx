import { COMISSAO_PERCENT, formatarBRL } from "@/lib/mock-data";
import type { Solicitacao } from "@/lib/solicitacoes-store";

function formatarData(iso: string) {
	return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

/** Texto do contrato de locação, gerado a partir dos dados da solicitação. */
export function ContratoLocacao({ solicitacao: s }: { solicitacao: Solicitacao }) {
	const entrega =
		s.tipoEntrega === "entrega"
			? `com entrega no endereço do LOCATÁRIO (frete de ${formatarBRL(s.frete)})`
			: "com retirada e devolução no local combinado entre as partes";

	return (
		<div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
			<p>
				Por este instrumento, <strong className="text-foreground">{s.locador}</strong> (LOCADOR)
				cede em locação ao LOCATÁRIO o equipamento{" "}
				<strong className="text-foreground">{s.maquinaNome}</strong>, pelo período de{" "}
				{formatarData(s.dataInicio)} a {formatarData(s.dataFim)} ({s.dias}{" "}
				{s.dias === 1 ? "diária" : "diárias"}).
			</p>
			<p>
				O LOCATÁRIO compromete-se a utilizar o equipamento conforme sua destinação, arcar com danos
				decorrentes de uso indevido e devolvê-lo nas mesmas condições ao fim do período, {entrega}.
			</p>
			<p>
				O valor total da locação é de{" "}
				<strong className="text-foreground">{formatarBRL(s.total)}</strong>, incluindo a taxa de
				serviço da plataforma ({COMISSAO_PERCENT}%)
				{s.frete > 0 ? ` e o frete de ${formatarBRL(s.frete)}` : ""}. Não há cobrança de caução.
			</p>
			<p>
				O pagamento é processado pela plataforma, que repassa o valor ao LOCADOR descontada a
				comissão. O aceite digital tem validade jurídica e registra data e hora.
			</p>
		</div>
	);
}
