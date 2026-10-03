# Fronteira Rust → TypeScript

## Rust é a fonte de verdade 🔴 — oportunidade ainda não explorada

O backend já expõe OpenAPI em memória via `utoipa` (montado em `routes/docs.rs`, servido em
`/docs` pelo `utoipa-swagger-ui`). Isso torna o contrato Rust → TypeScript **gerável hoje**, sem
infra nova:

- **`openapi-typescript`** sobre o JSON do `utoipa` (`/api-docs/openapi.json`) gera os tipos do
  cliente — modelos **e** paths/métodos/status. Destino sugerido: `interfaces/generated/` ou
  `lib/api/generated/`.

**Estado atual (dívida):** os tipos do cliente são escritos à mão em `interfaces/index.ts` e os
métodos HTTP à mão em `services/*.ts`. Todo DTO do Rust tem um espelho manual em TS que pode
divergir em silêncio. Gerar a partir do OpenAPI elimina essa classe de bug.

A direção é Rust → TypeScript porque o TS é mais expressivo onde importa (union type, campo
opcional, literal) — gerar nessa direção não perde informação.

## Regime do artefato gerado 🔴 (quando o gerador existir)

Vale para `schema.rs` (Diesel, já gerado) e para o futuro gerador de tipos TS:

1. **O gerado é commitado**, com cabeçalho marcando que é gerado (`schema.rs` já tem
   `// @generated automatically by Diesel CLI.`).
2. **Modo `--check`** no CI que regenera e falha listando divergências, com a instrução de
   correção na própria mensagem ("rode `diesel print-schema`/`generate:types` e commite").
3. **Nunca editar o gerado à mão** — ampliar o que atravessa é mudança de configuração revisada
   em PR.
4. **O output passa pelo formatador do destino** antes de commitar (`rustfmt` para `.rs`,
   `biome format`/`prettier` para `.ts`), senão formatador e guard de drift discordam.

## Casing: camelCase no fio 🔴

**Estado atual:** os structs Diesel usam `snake_case` (`id_usuario`, `id_publico`,
`tempo_geracao_ms`) e são serializados assim para o cliente; `interfaces/` espelha em snake_case.
Isso é internamente consistente — **o que a regra proíbe é a divergência**, não o snake_case em si.

Alvo quando o contrato for gerado: struct serializado para o cliente leva
`#[serde(rename_all = "camelCase")]` no struct inteiro — **nunca** `#[serde(rename = "…")]` campo
a campo. Até lá, mantenha **uma** grafia só (a atual) de ponta a ponta.

Fora do escopo: enum de valor de domínio (ex.: `TipoUsuario`) — é casing de **variante**, não de
campo; e `Claims` do JWT — não é contrato de UI.

### "Um conceito, uma grafia" 🔴

Um campo não existe em duas grafias — não no fio, não no tipo (gerado ou manual), não no código do
cliente. A regra veda, especificamente:

1. `#[serde(rename)]` campo a campo para fazer casing — casing é decisão de `rename_all` no struct.
2. Dois structs do mesmo domínio com `rename_all` divergente.
3. Tipo TS com as duas grafias como campos distintos.
4. Adaptador que traduz `id_usuario → idUsuario` e mantém as duas vivas — é dívida, não solução;
   `serde` resolve isso na origem.

## Mudou X ⇒ verifique Y

- `#[utoipa::path]` ou DTO novo/alterado ⇒ (quando o gerador existir) regenerar os tipos TS e
  commitar; até lá, atualizar à mão `interfaces/` **e** `services/` no mesmo PR, sem deixar
  espelho divergente.
- Migration adiciona coluna/tabela ⇒ `diesel print-schema` regenera `schema.rs`
  ([database.md](database.md)).
- Campo renomeado no Rust ⇒ propague até `interfaces/` e `services/`; não crie um alias que
  mantenha a grafia antiga viva.
