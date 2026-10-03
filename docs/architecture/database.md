# Banco de dados

Diesel + `diesel-async` (pool deadpool) sobre Postgres. Migrations em `src-back/migrations/`,
schema gerado em `src-back/src/schema.rs`.

## `up.sql`/`down.sql` idempotentes 🔴

Todo `up.sql` precisa ser seguro para re-execução: `CREATE TABLE IF NOT EXISTS`,
`CREATE INDEX IF NOT EXISTS`, tipo novo guardado por
`DO $$ BEGIN IF NOT EXISTS (...) THEN CREATE TYPE ...; END IF; END $$;`, backfill guardado por
`WHERE NOT EXISTS (...)`. Motivo concreto (herdado do mesmo comportamento do Diesel observado no
Zeile): o Diesel normaliza o timestamp da pasta de migration removendo hífens; se
`__diesel_schema_migrations` tiver a versão gravada de forma diferente da que o Diesel computa, ele
considera a migration pendente e **re-executa o `up.sql`** — sem idempotência isso é `panic` de
"already exists".

`down.sql` é obrigatório e deve declarar a destrutividade no cabeçalho: `-- reversível`,
`-- destrutiva` ou `-- irreversível`. `ALTER TYPE … ADD VALUE` não tem contraparte de remoção no
Postgres — `down.sql` de migration de enum é irreversível por natureza, e isso precisa estar
escrito.

## Nome de migration sem sufixo manual 🟡 — dívida conhecida

As migrations deste repo usam o sufixo manual `-0000`
(`2025-12-22-220107-0000_criar_enderecos_usuarios`), que não faz parte do formato padrão do
Diesel. Pior: existem **duas migrations com o mesmo nome lógico** —
`2026-03-26-221818-0000_add_tempo_geracao_to_contratos` e
`2026-03-26-222701-0000_add_tempo_geracao_to_contratos`. Conferir se a duplicata é intencional
(uma correção da outra) ou lixo a consolidar; migration nova segue o formato padrão do Diesel,
sem sufixo inventado à mão.

## DDL separado de seed/backfill 🟡

Seed e backfill (dado que roda uma vez, ou que popula default para linha existente) não são DDL e
não moram em `migrations/`.

## `timestamptz`, sempre 🔴

Toda coluna de timestamp usa `timestamptz`, nunca `timestamp` sem timezone. O backend usa
`chrono::NaiveDateTime` nos structs e o frontend renderiza data no cliente — `timestamp` sem tz é
ambíguo entre servidor e cliente em fusos diferentes. **Auditar as migrations existentes** e, onde
houver `TIMESTAMP` sem tz, corrigir com `ALTER COLUMN ... TYPE timestamptz`.

## Erro do Diesel mapeado por causa 🔴

Consequência também descrita em [rust-rules.md](rust-rules.md) e [security.md](security.md):
`UniqueViolation` → 409, `NotFound` → 404, `ForeignKeyViolation` → 400, **sem** vazar a mensagem
crua do driver ao cliente. Hoje `ApiError::Database(String)` faz exatamente o oposto — é a dívida
central a fechar.

## `schema.rs` é gerado 🔴

Não editar à mão. Após qualquer migration:
`diesel print-schema --database-url "$DATABASE_URL" > src/schema.rs` (dentro de `src-back/`). O
cabeçalho `// @generated automatically by Diesel CLI.` marca isso. A reorganização de
relationships já ajustou os `diesel::joinable!` — mantê-los coerentes com as FKs reais.

## Mudou X ⇒ verifique Y

- Migration nova com `TIMESTAMP` sem `tz` ⇒ bloqueante — use `timestamptz` desde o início.
- Migration de enum (`ALTER TYPE ... ADD VALUE`) ⇒ `down.sql` documenta que é irreversível.
- Seed/backfill novo ⇒ tarefa idempotente fora de `migrations/`, não uma migration.
- `schema.rs` desalinhado após migration ⇒ `diesel print-schema`, commitar o diff.
- FK nova ⇒ `diesel::joinable!` correspondente em `schema.rs` e, se o modelo usa `Associations`,
  o `#[diesel(belongs_to(...))]` no struct ([models/maquinas.rs](../../src-back/src/models/maquinas.rs)).
