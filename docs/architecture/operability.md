# Operabilidade

## `health/live` + `health/ready`, separados 🔴 — ausente hoje

Fora do prefixo `/api` (como `/docs`). `live` responde sempre que o processo está de pé; `ready`
checa o pool de conexão com o banco. Sem a separação, um Postgres oscilando faz o orquestrador
**matar** um processo saudável em vez de tirá-lo do balanceador — problemas opostos que um
endpoint único não distingue. Hoje existe só um `test_health_check` em `tests/mod.rs`, sem rota de
produção correspondente.

## Erro descritivo no boot 🔴 — dívida conhecida

**Estado atual:** `main.rs` faz `.unwrap()` em cada passo de inicialização —
`Pool::builder(...).build().unwrap()`, `TcpListener::bind(...).unwrap()`,
`axum::serve(...).await.unwrap()` — e para o DB_URL faz um `return` silencioso. Falha de boot vira
panic cru em vez de diagnóstico. Alvo: cada falha de inicialização (bind, build do pool, config
TLS) vira erro com mensagem acionável e exit code definido — "porta 3099 já em uso" é diagnóstico;
um panic dentro do `tokio-postgres-rustls` não é.

> Detalhe a limpar: a mensagem de erro de env diz `"DB_URL não está definida"`, mas
> `get_database_url_from_env()` lê `DATABASE_URL`. Alinhar a mensagem à variável real.

## Timeout obrigatório em I/O externo 🔴

`reqwest` (APIs externas) e `lettre` (SMTP) têm timeout configurável por env
(`HTTP_CLIENT_TIMEOUT_SECS`, `SMTP_TIMEOUT_SECS`), nunca sem limite. Sem timeout, um provedor lento
prende um worker do tokio — e no envio de e-mail/validação isso pode estar no caminho crítico.

## `request_id` no tracing 🟡

O `TraceLayer` do `tower-http` já está montado em `routes/mod.rs`. O passo seguinte é propagar um
`request_id` por requisição no span, suficiente para amarrar um erro à requisição que o causou sem
migrar para log JSON completo. O `src-back/plan.md` já prevê middleware de métricas (contagem de
requisições, tempo de resposta) — `request_id` encaixa no mesmo lugar.

## Shutdown gracioso 🔴 — ausente hoje

`axum::serve(...)` roda sem `.with_graceful_shutdown`. Alvo: capturar SIGTERM/SIGINT, parar de
aceitar conexão nova e drenar o pool antes de sair, sob um teto de tempo (`SHUTDOWN_GRACE_SECS`,
default ~5s). Importa mais quando houver trabalho em andamento no shutdown (ex.: uma geração de
PDF em curso).

## Mudou X ⇒ verifique Y

- Passo de inicialização novo no `main.rs` ⇒ erro acionável com exit code, não `.unwrap()`.
- Chamada de I/O externo nova (novo provedor, novo serviço de e-mail) ⇒ timeout por env desde o
  primeiro commit, não como correção depois.
- Task de fundo nova spawnada no boot ⇒ o shutdown gracioso precisa de handle dela para
  esperar/cancelar.
