# Segurança

## Segredo nunca em `NEXT_PUBLIC_*` 🔴

Qualquer variável `NEXT_PUBLIC_*` é inlined no bundle JavaScript servido ao cliente — nunca
recebe segredo. Hoje o frontend usa `NEXT_PUBLIC_API_URL` (URL base, pública — ok). `JWT_SECRET`
vive **só** no backend. Nenhuma chave, segredo de assinatura ou credencial pode ganhar prefixo
`NEXT_PUBLIC_`. Tabela completa em [env-vars.md](env-vars.md).

## Token no cliente 🟡

O token JWT é guardado em `localStorage["MAQEXPRESS_TOKEN"]` e injetado por `BaseApi`. Token em
`localStorage` é legível por qualquer script na página (exposto a XSS). Registrar como trade-off
conhecido; se o escopo de segurança subir, o alvo é cookie `HttpOnly`.

## CORS por ambiente 🔴 — dívida conhecida

**Estado atual:** `routes/mod.rs` fixa `allow_origin(["http://localhost:3000"])` e
`allow_methods(Any)` **hardcoded**. Isso trava produção e é frágil. Alvo: lista de origens vinda de
`CORS_ALLOWED_ORIGINS` (env, separada por vírgula), nunca wildcard; sem a variável, cair só em
`localhost:3000` como default de dev.

## Body limit por rota 🔴 — dívida conhecida

**Estado atual:** `routes/mod.rs` aplica `DefaultBodyLimit::max(100 MB)` **global**. 100 MB em toda
rota, sem rate limit, é vetor de negação de serviço barato. Alvo: limite global baixo (1 MB) e
override de 100 MB **só** nas rotas que legitimamente recebem payload grande (upload de imagem de
máquina, `multipart`). A combinação body limit + rate limit é o que fecha o vetor.

## Rate limit 🔴 — ausente hoje

Janela por IP, resposta 429 com `Retry-After`, nas rotas onde o custo de abuso é real:

| Rota | Razão |
|---|---|
| `POST /api/usuario/login` | força bruta de credencial |
| recuperação de senha / e-mail (`lettre`) | enumeração de e-mail + custo de envio |
| geração de contrato/PDF (`printpdf`) | custo de CPU por requisição |

Nenhum rate limit existe hoje — é item de refatoração, não regressão.

## Erro de infraestrutura nunca vaza no 5xx 🔴 — dívida conhecida crítica

O cliente recebe mensagem genérica com código; o detalhe (nome de tabela, constraint, coluna) vai
só para o log estruturado do servidor. **Estado atual:** `ApiError::Database(String)`,
`DatabaseConnection(String)` e `Request(String)` serializam a mensagem crua do driver direto no
corpo da resposta. É a dívida de segurança #1, acoplada ao erro estruturado de
[rust-rules.md](rust-rules.md) e ao mapeamento por causa de [database.md](database.md).

## Mudou X ⇒ verifique Y

- Rota nova que aceita payload grande (upload, import) ⇒ body limit dedicado nessa rota, nunca
  subir o limite global.
- Rota nova de custo alto (envio de e-mail, geração de PDF, login) ⇒ considerar rate limit.
- Var de ambiente nova ⇒ conferir contra [env-vars.md](env-vars.md); se for segredo, jamais
  `NEXT_PUBLIC_*`.
- `ApiError` nova que pode carregar detalhe sensível ⇒ confirmar que o corpo da resposta não
  expõe a string crua.
