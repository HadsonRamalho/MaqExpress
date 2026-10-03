# Organização do frontend

Stack: Next.js (App Router) + React 19 + TypeScript, cliente HTTP `axios` em camada `services/`.

## Pastas de topo 🔴

| Pasta | O que mora lá |
|---|---|
| `app/` | rotas (App Router): uma pasta por rota, `page.tsx`/`layout.tsx`. Só composição de UI — nada de chamada HTTP crua. |
| `components/` | componentes de UI. `components/ui/` é o genuinamente compartilhado (design system); subpastas por domínio (`machines/`, `contracts/`, `rental/`, `profile/`, `notifications/`, `dashboard/`, `auth/`) agrupam o resto. |
| `services/` | **única** camada que fala com o backend. Cada arquivo estende `BaseApi` e expõe os métodos de um domínio (`maquina.ts`, `empresa.ts`, `solicitacao.ts`, `endereco.ts`, `auth.ts`). |
| `hooks/` | hooks de React compartilhados (`use-auth`, `use-mobile`, `use-toast`). |
| `interfaces/` | tipos TypeScript. Ver dívida abaixo. |
| `lib/` | infraestrutura sem estado e sem React (`utils.ts`). |

## `services/` é a fronteira HTTP 🔴

Componente **não** chama `fetch`/`axios` direto — chama um método de `services/`. `BaseApi`
(`services/BaseApi.ts`) centraliza `baseURL`, `Content-Type` e a injeção do token
(`Authorization: Bearer`, lido de `localStorage["MAQEXPRESS_TOKEN"]`). Toda resposta do backend
entra na aplicação por aqui; é o ponto de maior retorno para tipagem forte e para o contrato
gerado de [contracts.md](contracts.md).

## `lib/` é infraestrutura sem estado e sem React 🔴

Qualquer coisa com estado React ou que dependa de contexto de componente não é `lib/`. Violação a
evitar: tipo de domínio importando de componente de UI — a correção certa é inverter a dependência
(o componente importa o tipo, nunca o contrário).

## `interfaces/` — dívida conhecida 🟡

`interfaces/index.ts` é um barril único (145 linhas) com os tipos de todos os domínios. Destino:
- curto prazo, quebrar por domínio (`interfaces/maquina.ts`, …);
- alvo real, **substituir pelos tipos gerados** a partir do OpenAPI do backend
  (`utoipa`) — ver [contracts.md](contracts.md). Tipo escrito à mão que espelha DTO do Rust é
  justamente o que o gerador elimina.

## Fronteiras de import 🟡 — enforcement pendente

Hoje não há enforcement de fronteira (sem config de ESLint/Biome no repo, ver abaixo). O alvo,
quando o lint for configurado via `noRestrictedImports`:

- `interfaces/`, `lib/` → **não** importam de `components/` (infraestrutura não depende de UI);
- `components/ui/` → **não** importa de componente de domínio.

Ao cruzar pasta de topo, o import usa `@/` (já configurado em `tsconfig.json` → `paths`); path
relativo só entre vizinhos na mesma pasta.

## `tsconfig.json` estrito 🔴 — parcialmente pendente

`strict: true` **já está ligado**. Faltam, como dívida a ativar incrementalmente:

- `noUncheckedIndexedAccess` — acesso a índice pode ser `undefined`.
- `exactOptionalPropertyTypes` — distingue "campo ausente" de "campo presente e `undefined`";
  é o par TypeScript da distinção que o Rust faz com `Option`.
- `noImplicitOverride`.
- `noFallthroughCasesInSwitch` — todo `switch` sobre enum de domínio acusa compilação quando um
  valor novo aparece sem tratamento.
- `forceConsistentCasingInFileNames` — ver [code-rules.md](code-rules.md).

## Lint: um só, configurado 🔴 — dívida conhecida

Estado atual: `package.json` declara `"lint": "eslint ."` **sem arquivo de config de ESLint** no
repo, e ao mesmo tempo lista `@biomejs/biome` em devDependencies (não usado). Além disso coexistem
**três lockfiles** (`bun.lock`, `package-lock.json`, `pnpm-lock.yaml`) e não há campo
`packageManager`. Decisão a tomar e registrar em ADR: **um** gerenciador de pacote e **um**
linter (recomendo Biome, alinhado ao Zeile), com config versionada e rodando no CI.

## Console 🟡

`console.log` evitar em código de produto (vaza dado em devtools); `console.warn`/`console.error`
permitidos. `scripts/**` isento.

## Mudou X ⇒ verifique Y

- Componente novo precisando de dado do backend ⇒ cria/usa método em `services/`, nunca `axios`
  direto no componente.
- Tipo novo de domínio ⇒ não cresce `interfaces/index.ts`; vai para o arquivo do domínio (ou é
  gerado do OpenAPI).
- `switch` sobre enum de domínio ⇒ depois que `noFallthroughCasesInSwitch` ligar, não silencie
  com `default` genérico.
