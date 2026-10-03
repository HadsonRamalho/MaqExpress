# Variáveis de ambiente

Fonte de verdade dos nomes: `src-back/env.example` (backend) e o uso em código. Esta tabela é
normativa — variável nova entra aqui **e** no `env.example` no mesmo PR.

## Backend (`src-back/`)

| Variável | Secreta? | Obrigatória? | Uso |
|---|---|---|---|
| `DATABASE_URL` | sim | sim | conexão Postgres do pool (`controllers/utils.rs::get_database_url_from_env`) |
| `TEST_DATABASE_URL` | sim | só em teste | banco de integração para `src/tests/` |
| `JWT_SECRET` | **sim** | sim | assinatura/validação do JWT (`controllers/jwt.rs`) — nunca exposto ao cliente |
| `FRONTEND_URL` | não | sim | base de link em e-mail e, no alvo, origem default de CORS |

### A introduzir (dívidas dos outros docs)

| Variável | Uso | Doc |
|---|---|---|
| `CORS_ALLOWED_ORIGINS` | lista de origens permitidas (CSV), substitui o hardcode | [security.md](security.md) |
| `HTTP_CLIENT_TIMEOUT_SECS` | timeout do `reqwest` | [operability.md](operability.md) |
| `SMTP_TIMEOUT_SECS` | timeout do `lettre` | [operability.md](operability.md) |
| `SHUTDOWN_GRACE_SECS` | teto do shutdown gracioso (default ~5s) | [operability.md](operability.md) |
| `PORT` | porta do servidor (hoje fixa em `3099` no `main.rs`) | [operability.md](operability.md) |

> Nota: a mensagem de erro do `main.rs` cita `DB_URL`, mas o código lê `DATABASE_URL`. A variável
> correta é `DATABASE_URL`; a mensagem é que está desatualizada (ver [operability.md](operability.md)).

## Frontend

| Variável | Secreta? | Obrigatória? | Uso |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | não (pública por design) | sim | base de URL do backend em `services/BaseApi.ts` |

**Regra 🔴:** `NEXT_PUBLIC_*` é inlined no bundle do cliente — **nunca** recebe segredo
(ver [security.md](security.md)). Segredo de frontend (se houver) vive sem o prefixo e só em
código de servidor (Route Handler / Server Component).

## Mudou X ⇒ verifique Y

- Variável nova ⇒ entra nesta tabela **e** em `src-back/env.example` (ou num `.env.example` de
  frontend) no mesmo PR.
- Variável de frontend com segredo ⇒ pare: ou não é segredo, ou não pode ser `NEXT_PUBLIC_*`.
