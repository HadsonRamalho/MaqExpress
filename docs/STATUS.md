# STATUS — MaqExpress

Registro vivo do estado do projeto para retomada (por outro agente ou pessoa).
Atualizar a cada entrega. Última atualização: 2026-10-04.

Branch de trabalho: `main` (pushes vão direto pra `main`, conforme o dono pediu).

## O que é o produto

Marketplace **híbrido** de aluguel de máquinas/equipamentos de construção (PF e PJ dos dois
lados). Monetização por **comissão por transação**; pagamento na plataforma com **split** via
**Mercado Pago**; contrato PDF + **aceite digital**; retirada no local; **sem caução** no MVP.
Decisões completas em `docs/produto/` (a criar) e nos ADRs; o plano do MVP foi aprovado
(resumo em "Pendente" abaixo).

## Stack

- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + shadcn/ui
  (new-york). Tema verde/emerald em `app/globals.css`. Fonte Hanken Grotesk. Lint/format = **Biome**.
- **Backend**: Rust (Axum + Diesel/`diesel-async` + Postgres), organizado **por domínio** em
  `src-back/src/domain/<nome>/{controller,model,routes}.rs` + `shared/` + `server.rs`.
- **Gerenciador de pacote**: **npm** (pnpm/bun não instalados; há `bun.lock`/`pnpm-lock.yaml`
  órfãos — dívida).

## Feito

### Infra / processo
- Merge da branch `relationships` na `main`; backend reorganizado por domínio (ADR 0001);
  corrigidos bugs que impediam o backend de compilar (`deletar_maquina`, `ToSchema`, `Clone`
  duplicado no `schema.rs`, fontes do PDF). `cargo check --all-targets` verde.
- Docs normativas em `docs/architecture/*` + `docs/README.md` + ADRs (`docs/decisions/`).
- Tooling: `.githooks/commit-msg` (formato de commit), `.github/` (CI, CODEOWNERS, PR template).
- **CI**: job frontend roda `npm run lint` = `biome check` (antes era `eslint .` → quebrava com
  "eslint: not found"). `biome.json` ignora `components/ui` (vendor), `*.css` e `hooks/use-toast.ts`.
- Skills instaladas: `frontend-design`, `shadcn`, `catcher` (em `.agents/skills/`, symlink em
  `.claude/skills/`).
- `@catcherjs/core` instalado + ADR 0006 (padrão de erro no front) — **ainda não aplicado no código**.

### Frontend (UI antiga descartada e reconstruída)
Grupos de rota: `(site)` (público, header+footer), `(auth)` (login/cadastro), `(app)` (painel
logado com sidebar + proteção de rota).
- **Home** `/` — hero com busca, categorias, destaques, como funciona, CTA locador.
- **Listagem** `/maquinas` — filtros (categoria, preço, disponível), ordenação, busca.
- **Detalhe** `/maquinas/[id]` — ficha + `SolicitarLocacao` (período, cálculo de comissão/total).
- **Auth** `/login`, `/cadastro` — ligados ao `useAuth`.
- **Painel** `/minhas-maquinas`, `/solicitacoes` (aceitar/recusar), `/cadastrar-maquina`,
  `/editar-maquina/[id]`, `/perfil`.
- Institucionais placeholder: `/como-funciona`, `/sobre-nos`.
- Sessão no header (menu do usuário + logout).
- **Dados mock** em `lib/mock-data.ts` (8 máquinas, solicitações) — ainda não ligado ao backend.

### Backend MVP — máquinas: preço + imagens (2026-10-04)
- Migrations novas (`src-back/migrations/`, convenção `-0000`):
  `2026-10-04-120000-0000_add_precos_maquinas` e `2026-10-04-120100-0000_criar_maquina_imagens`.
- **Preços** na tabela `maquinas`: `preco_diaria` (NOT NULL), `preco_semanal`, `preco_mensal` —
  **em centavos de BRL (`i64`/BIGINT)** para evitar float em dinheiro. Validação `range(min=1)`.
  Fluem por `cadastrar`/`atualizar`/`listar` (o `GET /maquina/listar` já devolve os preços).
- **Imagens**: tabela `maquina_imagens` (id, id_maquina FK `ON DELETE CASCADE`, url, ordem,
  principal, data_cadastro) + modelo `MaquinaImagem` + CRUD. Guarda só URL/metadados — o upload
  do binário (Supabase Storage) continua pendente.
- Endpoints novos em `/maquina`: `POST /{id}/imagens`, `GET /{id}/imagens` (público),
  `DELETE /{id}/imagens/{id_imagem}`. Add/remove checam dono (`garantir_dono_maquina` → 403/404).
- Contrato TS sincronizado à mão: `interfaces/index.ts` (`Maquina`, `CadastrarMaquina`,
  `MaquinaImagem`, `AdicionarImagemDto`) e `services/maquina.ts`
  (`listarImagens`/`adicionarImagem`/`removerImagem`). `cargo check --all-targets` e `biome` verdes.

## Pendente / próximos passos (ordem sugerida)

1. **Migrar tratamento de erro para Catcher** (ADR 0006): `services/BaseApi.ts` + `services/*`
   devolvendo `Result<T, E>`, definir um `ApiError` de frontend a partir de `{code, message}` do
   backend, depois `hooks/use-auth.tsx`.
2. **Ligar frontend ao backend real** (substituir `lib/mock-data.ts` por `services/maquina.ts`
   etc.) — backend já expõe **preço** e **imagens** (feito 2026-10-04). Falta a UI consumir
   (listagem/detalhe/cadastro usar preços reais + galeria de imagens) e incluir os campos de
   preço nos forms de `/cadastrar-maquina` e `/editar-maquina/[id]`.
3. **Backend MVP** (ver plano aprovado):
   - ~~Máquinas: campos de preço (diária/semana/mês) + tabela de imagens.~~ **Feito 2026-10-04**
     (preços em centavos; tabela `maquina_imagens` com URL — upload Supabase ainda pendente).
   - Máquinas: faltam ainda **categoria** e **localização** (mock tem `categoriaSlug`, `cidade/uf`).
   - Status da locação como **enum Postgres** (hoje `SolicitacaoContrato.status` é `String`).
   - Disponibilidade/calendário; **pagamentos** (novo domínio) + split Mercado Pago + webhook;
     contrato + aceite digital; avaliações; chat.
   - Storage **Supabase** (imagens + PDFs) no lugar do `ServeDir` local.
   - Auth: refresh token + login Google (hoje JWT simples).
4. **Contrato de tipos Rust→TS** via `openapi-typescript` sobre o OpenAPI do `utoipa`
   (ver `docs/architecture/contracts.md`) — elimina os tipos manuais em `interfaces/`.
5. Criar `docs/produto/mvp.md` e `docs/produto/fluxos.md` (Fase 0 do plano, ainda não escritos).

## Dívidas conhecidas (cuidado ao retomar)

- **Auth bypass LIGADO**: `hooks/use-auth.tsx` tem `DEV_AUTH_BYPASS = true` — login/cadastro
  entram **sem backend e sem validação** (cria usuário de teste). Voltar para `false` quando o
  backend estiver no ar. Validação dos forms de auth foi removida junto.
- **Backend (segurança/operabilidade)**: `ApiError::Database(String)` vaza mensagem do driver;
  CORS e body-limit (100MB) hardcoded; `.unwrap()` no boot; sem health/ready nem shutdown
  gracioso. Detalhado em `docs/architecture/{security,operability,rust-rules}.md`.
- **Rust CI**: o job `rust` só roda quando `src-back/**` muda; quando rodar, `clippy -D warnings`
  vai falhar por imports não usados em `src-back/src/tests/{e2e,usuarios}.rs` (sobras da reorg) —
  limpar antes do próximo push que toque o backend.
- **Migrations**: sufixo manual `-0000` e uma migration duplicada
  (`add_tempo_geracao_to_contratos`) — ver `docs/architecture/database.md`.
- **Limpeza frontend**: `styles/globals.css` é código morto (o válido é `app/globals.css`);
  `tailwindcss-animate` legado coexiste com `tw-animate-css`; `bun.lock`/`pnpm-lock.yaml` órfãos.
- **Detalhe/solicitar e painel usam mock** (`lib/mock-data.ts`); nada persiste de verdade.

## Como rodar

- **Frontend**: `npm run dev` → `/`, `/maquinas`, `/login`, `/minhas-maquinas`, etc.
  Precisa de `NEXT_PUBLIC_API_URL` no `.env` para falar com o backend (com o bypass ligado, a
  navegação autenticada funciona sem backend).
  Lint: `npm run lint` (Biome). Build: `npm run build`.
- **Backend**: `cargo` **não está no PATH** — usar `export PATH="$HOME/.cargo/bin:$PATH"` antes.
  `cd src-back && cargo check --all-targets`. Testes de integração precisam de Postgres com
  `DATABASE_URL`/`TEST_DATABASE_URL`.

## Notas de ambiente

- Só `npm` disponível (sem pnpm/bun). `gh` autenticado (com escopo `workflow`).
- O ambiente às vezes **auto-commita** mudanças (apareceram commits "feat: iniciando refactor"
  não feitos pelo agente) — conferir `git log`/`git status` antes de commitar.
- Fonte das regras/tooling: clone do Zeile em `~/Documents/zeile-notebook` (mesma stack).

## Referências rápidas

- Normas: `docs/README.md` + `docs/architecture/*`.
- Decisões: `docs/decisions/` (0001 backend por domínio, 0006 erro no front via Catcher).
- Referência BillingSDK: `docs/reference/billingsdk.md`.
