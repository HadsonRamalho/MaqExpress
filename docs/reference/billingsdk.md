# Billing SDK — referência (CLI + componentes)

> Material de referência salvo a pedido, da documentação oficial do Billing SDK
> (https://billingsdk.com). O Billing SDK é construído sobre shadcn/ui. Para o MaqExpress,
> usaremos componentes de UI (ex.: `pricing-table-one`); a integração de pagamento do projeto é
> **Mercado Pago** (ver [[maqexpress-refactor]] e o ADR de pagamentos), **não** os provedores
> nativos do Billing SDK (Dodo Payments / Stripe). Portanto, tratar as partes de "init /
> provider / API routes" abaixo como referência, e usar o SDK apenas pela camada de componentes
> (`npx @billingsdk/cli add <component>` ou `npx shadcn@latest add @billingsdk/<component>`).

## Instalação da CLI

```bash
npx @billingsdk/cli --help
# ou global:
npm install -g @billingsdk/cli
@billingsdk/cli --help
```

## Quick start

```bash
# Inicializa um projeto (interativo) — para o MaqExpress NÃO usamos (provider próprio: Mercado Pago)
npx @billingsdk/cli init

# Adiciona um componente a um projeto existente — é o que usamos
npx @billingsdk/cli add <component-name>
```

## Comandos

- **init** — inicializa um projeto de billing com framework + provider (Dodo/Stripe). Não usado aqui.
- **add** — adiciona componentes individuais ao projeto existente. **É o que usamos.**
- **build** — build do registry (ferramenta de mantenedor).

## Frameworks suportados

| Framework  | Dodo Payments | Stripe       |
| ---------- | ------------- | ------------ |
| Next.js    | Sim           | Sim          |
| Express.js | Sim           | Sim          |
| Hono       | Sim           | Sim          |
| NestJS     | Sim           | Sim          |
| React      | Sim           | Sim          |
| Fastify    | Sim           | Em breve     |

## Providers de pagamento suportados (nativos do SDK)

- **Dodo Payments** — totalmente suportado (Next.js, Express.js, React.js, Hono, Fastify).
- **Stripe** — suportado para Next.js, React.js, Express.js e Hono (Fastify em breve).

> No MaqExpress o provider é **Mercado Pago** (não coberto pelo `init` do SDK). Usamos só os
> componentes visuais; a lógica de checkout/split/webhook é implementada no backend Rust.

---

## `@billingsdk/cli add` (uso no MaqExpress)

```bash
npx @billingsdk/cli add pricing-table-one
npx @billingsdk/cli add subscription-management
npx @billingsdk/cli add usage-meter-circle
```

O que acontece:
1. Baixa a configuração do componente do registry.
2. Instala os arquivos em `components/billingsdk/`.
3. Atualiza a config do projeto se necessário.
4. Instala dependências adicionais.

Equivalente via shadcn CLI:

```bash
npx shadcn@latest add @billingsdk/pricing-table-one
```

Registry no `components.json`:

```json
{
  "registries": {
    "@billingsdk": "https://billingsdk.com/r/{name}.json"
  }
}
```

---

## Interfaces TypeScript

Ao instalar um componente que usa `Plan`, é criado `lib/billingsdk-config.ts` com o array `plans`.

```ts
interface Plan {
  id: string
  title: string
  description: string
  highlight?: boolean
  type?: 'monthly' | 'yearly'
  currency?: string
  monthlyPrice: string
  yearlyPrice: string
  buttonText: string
  badge?: string
  features: {
    name: string
    icon: string
    iconColor?: string
  }[]
  benefits?: string[]
}

interface CurrentPlan {
  plan: Plan
  type: 'monthly' | 'yearly' | 'custom'
  price?: string
  nextBillingDate: string
  paymentMethod: string
  status: 'active' | 'inactive' | 'past_due' | 'cancelled'
}
```

> Observação MaqExpress: o modelo de receita é **comissão por transação** de aluguel, não
> assinatura. O array `plans`/`Plan` do SDK serve para telas de planos/preços de exibição; o
> cálculo real de valor do aluguel + comissão vem do backend. Adaptar conforme necessário.

---

## Catálogo de componentes

### Pricing & conversão
- **Pricing Table One** — tabela essencial, temas classic/minimal.
- **Pricing Table Two–Eight** — variações (comparação de features, gradiente, contato, slider de usuários, hover-to-reveal, etc.).
- **Banner** — banner promocional/aviso, variantes: default, minimal, popup, destructive, warning, success, info, announcement; suporta `gradientColors`, `autoDismiss`, `onDismiss`.

### Gestão de assinatura
- **Manage Subscription** (`subscription-management`) — dashboard de assinatura.
- **Invoice History** — tabela de faturas/recibos (status paid/refunded/open/void).
- **Usage Table** — uso por modelo (tokens/custo) — orientado a LLM.
- **Update Plan Card / Update Plan Dialog** — upgrade/downgrade de plano.
- **Limited Offer Dialog** — oferta por tempo limitado.
- **Proration Preview** — preview de ajuste de cobrança em troca de plano.
- **Usage-based Pricing** — slider interativo de créditos.
- **Trial Expiry Card** — contagem regressiva de trial.
- **Upcoming Charges** — próximas cobranças do ciclo.

### Pagamento
- **Payment Details / Payment Details Two** — formulário de cartão + endereço, detecção de bandeira, validação.
- **Payment Card** — interface final de pagamento com preview do cartão.
- **Payment Method Selector** — cartões, carteiras digitais, UPI (Índia), BNPL.
- **Payment Success Dialog** — confirmação de sucesso.
- **Payment Failure** — falha com motivos + ações (retry/home/support).

### Cancelamento
- **Cancel Subscription Dialog / Card** — fluxo de cancelamento em duas etapas, com retenção.

### Billing & analytics
- **Billing Screen** — dashboard com saldo de créditos, plano e cartão visual.
- **Usage Meter Linear / Circle** — medidores de uso (variantes linear/circle, tamanhos sm/md/lg, `progressColor` default/usage).
- **Detailed Usage Table** — breakdown de consumo por recurso (percentual auto-calculado).
- **Billing Setting / Billing Settings 2** — preferências de billing, métodos de pagamento, faturas, limites; 180+ moedas, validação custom.

---

## Exemplos de uso (componentes mais relevantes p/ o MaqExpress)

### Pricing Table One

```tsx
import { PricingTableOne } from "@/components/billingsdk/pricing-table-one";
import { plans } from "@/lib/billingsdk-config";

export function PricingTableOneDemo() {
  return (
    <PricingTableOne
      plans={plans}
      title="Pricing"
      description="Choose the plan that's right for you"
      onPlanSelect={(planId) => console.log("Selected plan:", planId)}
      size="medium" // small, medium, large
      theme="classic" // minimal or classic
      className="w-full"
    />
  );
}
```

Props: `plans: Plan[]`, `title`, `description`, `onPlanSelect(planId)`, `size: "small"|"medium"|"large"`, `theme: "minimal"|"classic"`.

### Banner

```tsx
import { Banner } from "@/components/billingsdk/banner";

<Banner
  title="🎉 Comece hoje!"
  description="Anuncie sua máquina e receba solicitações de locação"
  buttonText="Anunciar máquina"
  buttonLink="/cadastrar-maquina"
  variant="default" // default | minimal | popup | destructive | warning | success | info | announcement
/>
```

### Payment Success / Failure (referência de UX de retorno de pagamento)

```tsx
import { PaymentSuccessDialog } from "@/components/billingsdk/payment-success-dialog";

<PaymentSuccessDialog
  open={open}
  onOpenChange={setOpen}
  price="99"
  currencySymbol="R$"
  productName="Locação — Escavadeira (3 dias)"
  proceedButtonText="Ver contrato"
  backButtonText="Voltar"
/>
```

---

## Theming

Componentes do Billing SDK são estilizados com shadcn/ui e respeitam as CSS variables do tema
(`--primary`, `--background`, etc.). O tema do MaqExpress está em `app/globals.css`
(ver tema verde/emerald). Imports `@import` sempre no topo do CSS.

## Licença

Billing SDK é GPL. Componentes são copiados para o projeto (padrão shadcn/registry).

Fonte: https://billingsdk.com/docs (CLI, interfaces, componentes). LLMs-full: https://billingsdk.com/llms-full.txt
