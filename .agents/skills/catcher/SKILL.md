---
name: catcher
description: >-
  Referência de uso da lib @catcherjs/core para tratamento de erro no frontend do
  MaqExpress via Result<T, E> (ok/err) e os wrappers catchError / catchErrorSync /
  catchErrorWithTimeout. Use ao escrever ou revisar código que chama rede, parse,
  services/ ou qualquer operação que pode falhar — em vez de try/catch cru ou throw.
---

# Catcher — tratamento de erro no frontend

`@catcherjs/core` trata erro como **valor** (inspirado no `Result` do Rust e no erro
explícito do Go). No MaqExpress é o **padrão único** de tratamento de erro no frontend:
código novo não usa `try/catch` cru nem `throw` solto — envolve a operação que pode
falhar e devolve/consome um `Result<T, E>`.

Pacote: zero dependências, TypeScript-first. Instalado via `@catcherjs/core`.

## Dois estilos de consumo (mesma `Result`)

A `Result` é híbrida: funciona como **tupla** (desestruturação estilo Go) e como
**objeto fluente**. Escolha por legibilidade no ponto de uso.

```ts
import { catchError, catchErrorSync } from "@catcherjs/core";

// Tupla (Go-style): bom para "early return" em erro
const [erro, dados] = await catchError(buscarUsuario(1));
if (erro) {
  // erro é o valor do erro; dados é undefined aqui
  return;
}
dados; // T, já estreitado

// Objeto fluente: bom para encadear transformações
const r = await catchError(buscarUsuario(1));
if (r.isOk()) {
  r.data; // T
} else {
  r.error; // E
}
```

## API

### Async
- `catchError(promiseOrFn, errorsToCatch?)` → `Promise<Result<T, E>>` — envolve uma Promise
  (ou função que retorna Promise). `errorsToCatch` opcional: lista de classes de erro a
  capturar (as demais voltam a propagar).
- `catchErrorWithTimeout(promiseOrFn, timeoutMs, errorsToCatch?)` — idem, com timeout (o
  erro vira `Error` de timeout se estourar). Use em I/O que pode travar.
- `fromPromise(promise, errorsToCatch?)` — alias de `catchError`, nome mais descritivo.

### Sync
- `catchErrorSync(fn, errorsToCatch?)` → `Result<T, E>` — executa função síncrona (ex.: `JSON.parse`).

### Construtores / conversões
- `ok(data)` / `err(error)` — cria `Result` de sucesso / falha (útil em `andThen`, mocks, testes).
- `fromNullable(value, error)` — `null`/`undefined` viram falha com `error`.
- `fromThrowable(fn, errorsToCatch?)` — transforma uma função que lança numa que retorna `Result`.

### Combinadores
- `combine([...results])` — array de `Result` → `Result` de array; para no **primeiro** erro.
- `combineAll([...results])` — coleta **todos** os erros.
- `partition(results)` — separa em `{ ok: T[], err: E[] }`.
- `catchErrorAll([...])` — roda várias operações async concorrentes e devolve os `Result`.

### Métodos da `Result`
`isOk()` / `isErr()` (type guards) · `unwrap()` (lança o erro) · `unwrapErr()` ·
`getOrElse(default)` · `map(fn)` · `mapErr(fn)` · `andThen(fn)` / `flatMap` ·
`orElse(fn)` (recupera do erro) · `tap(fn)` / `tapErr(fn)` (efeito colateral, ex.: log) ·
`toPromise()`.

## Convenções do MaqExpress

- **`services/` é a fronteira HTTP** (`services/BaseApi.ts` + por domínio). É o ponto de maior
  retorno: envolva as chamadas `axios` com `catchError` e devolva `Result<T, ApiError>` em vez
  de deixar o erro vazar como exceção. Quem chama (hook/componente) consome o `Result`.
- **Código novo nasce com `Result`** — sem `try/catch` cru nem `throw` solto. Migração do
  legado é incremental, arquivo por arquivo.
- **Tipar o erro**: prefira um tipo de erro próprio (ex.: `ApiError` do cliente) a `any`. Isso
  casa com a regra "nenhum `throw` cru" de `docs/architecture/rust-rules.md` (contraparte no front)
  e com a fronteira de erro de `docs/architecture/contracts.md`.
- **UI**: em handler de formulário/ação, desestruture `[erro, dados]`, mostre o erro com `toast`
  (sonner) e faça early-return; não relance.

Exemplo numa chamada de service:

```ts
// services/maquina.ts (alvo)
import { catchError } from "@catcherjs/core";

async listar(): Promise<Result<Maquina[], Error>> {
  return catchError(this.api.get<Maquina[]>("/listar").then((r) => r.data));
}
```

```tsx
// no componente
const [erro, maquinas] = await maquinaService.listar();
if (erro) {
  toast.error("Não foi possível carregar as máquinas.");
  return;
}
// usar maquinas
```

Decisão correspondente (origem): Zeile Q109. Ver ADR `docs/decisions/0006-tratamento-de-erro-frontend-catcher.md`.
