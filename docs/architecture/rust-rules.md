# Backend Rust

Stack: Axum 0.8 + Diesel + `diesel-async` (pool deadpool) sobre Postgres, JWT via
`jsonwebtoken`, OpenAPI via `utoipa`/`utoipa-swagger-ui`, e-mail via `lettre`, PDF via `printpdf`.

## Organização por domínio, raiz por módulo 🔴 — alvo da refatoração

**Estado atual (a sair):** organização por **camada** — `controllers/`, `models/`, `routes/`, cada
uma com um arquivo por domínio (`controllers/maquinas.rs`, `models/maquinas.rs`,
`routes/maquinas.rs`). Alterar uma rota de máquina abre três diretórios diferentes; o que muda
junto fica espalhado por arquivos que só se relacionam pelo nome.

**Alvo (a entrar):** raiz por **módulo de domínio** — ver
[decisions/0001](../decisions/0001-organizacao-backend-por-dominio.md).

```
src/
  domain/
    maquinas/
      mod.rs          # declara os submódulos e reexporta o router do domínio
      controller.rs   # handlers Axum: extrai request, chama a regra, mapeia resposta — fino
      model.rs        # struct Diesel (entity) + regra de negócio/acesso a banco
      routes.rs       # monta o OpenApiRouter do domínio
      dto.rs          # (quando necessário) request/response distinto do struct Diesel
    empresas/ …  enderecos/ …  solicitacoes/ …  usuarios/ …  relatorios/ …
  shared/             # transversal, não é domínio
    error.rs          # ApiError
    jwt.rs            # middleware/extractor de auth
    validadores.rs    # Sanitize/validação
    utils.rs
  schema.rs           # gerado pelo Diesel — não editar à mão
  main.rs
```

Migração **incremental, um domínio por PR** — não big-bang. O split mais profundo
(service/repository separados, DTO sempre distinto da entity) é evolução posterior; o primeiro
passo é só **co-localizar por domínio** o que hoje está espalhado por camada.

`entity` (struct Diesel) **não** deve ser serializado como resposta de API direta quando o DTO
divergir do modelo de banco — `dto` é a fronteira exposta ao cliente e é onde o gerador do
contrato ([contracts.md](contracts.md)) olha.

## Rotas e autenticação 🔴

O router é montado em `routes/mod.rs` (`new_init_routes`), com as rotas protegidas atrás de
`middleware::from_fn_with_state(pool, jwt_auth)` (`protected_routes`). Rota que acessa recurso de
usuário passa pela camada de auth **antes** do handler — nunca checagem manual de token dentro do
handler.

## Erro estruturado 🔴 — dívida conhecida crítica

`ApiError` (`models/error.rs` → futuro `shared/error.rs`) é hoje serializado direto como
`Json<ApiError>`. Dois problemas a corrigir:

- **Vazamento de detalhe de infraestrutura.** As variantes `Database(String)`,
  `DatabaseConnection(String)` e `Request(String)` carregam a mensagem crua do driver e a
  devolvem ao cliente. Isso viola [security.md](security.md): erro de infra nunca vaza no corpo
  da resposta. A mensagem crua vai só para o log; o cliente recebe código + mensagem genérica.
- **Sem mapeamento por causa.** O erro do Diesel precisa virar status pela causa real —
  `UniqueViolation` → 409, `NotFound` → 404, `ForeignKeyViolation` → 400 — cada um com variante
  própria de `ApiError`, não um `Database(String)` catch-all que cai em 500/400 genérico.

Alvo: `impl IntoResponse for ApiError` com `match` **exaustivo** (sem braço `_ => 500`), para que
variante nova force a decisão de status no ponto onde é criada.

- **Proibir `let _ = resultado` sobre `Result`** 🔴 — descartar erro em silêncio esconde bug.
  `cargo clippy -- -D warnings` pega boa parte disso.

## `validator` nos DTOs de request 🟡

Request usa `validator` (já é dependência; `validadores.rs` tem `Sanitize`/`Texto`). O TypeScript
confia no tipo gerado e não reimplementa a validação; `zod`/validação de form fica no frontend só
para o que ainda não passou pelo backend.

## Gate do clippy 🔴 — enforcement pendente (ver CI)

`cargo fmt --all --check` + `cargo clippy --all-targets -- -D warnings` + `cargo test`,
bloqueantes no CI (`.github/workflows/ci.yml`). Hoje o `main.rs` tem `.unwrap()` de boot que o
clippy não reprova por si — isso é tratado em [operability.md](operability.md).

## Mudou X ⇒ verifique Y

- `ApiError` ganha variante ⇒ o `match` do `IntoResponse` (quando existir) força tratamento de
  status; confirme que a variante não vaza detalhe sensível no corpo ([security.md](security.md)).
- Domínio novo ⇒ nasce já em `domain/<nome>/`, não em `controllers/`+`models/`+`routes/`.
- Rota nova que acessa recurso de usuário ⇒ entra sob `protected_routes`/`jwt_auth`, nunca com
  checagem manual de token no handler.
- Migration altera tabela ⇒ `diesel print-schema` regenera `schema.rs` ([database.md](database.md)).
