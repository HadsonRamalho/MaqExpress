# 0006 — Tratamento de erro no frontend com @catcherjs/core

## Contexto

O frontend trata erro de forma ad-hoc: `try/catch` espalhado nos componentes e `throw` cru
propagando de `services/` para cima (ex.: `hooks/use-auth.tsx` captura e relança). Não há um
mecanismo único — cada chamador reimplementa o tratamento, e o tipo do erro costuma virar `any`.
O `docs/architecture/rust-rules.md` já estabelece "nenhum `throw` cru" como contraparte no front
da regra de erro estruturado do backend, mas faltava o mecanismo.

## Alternativas

1. **Manter `try/catch` + um `ApiClientError` próprio.** Zero dependência, mas cada chamador
   repete o padrão e nada garante consistência; o tipo do erro tende a escapar para `any`.
2. **Adotar `@catcherjs/core`** — erro como valor via `Result<T, E>` (`ok`/`err`) e os wrappers
   `catchError` / `catchErrorSync` / `catchErrorWithTimeout`. Pacote pequeno, zero dependências,
   TypeScript-first. (Mesma escolha do Zeile, Q109.)

## Decisão

Alternativa 2. `@catcherjs/core` é o **padrão único** de tratamento de erro no frontend.

- **`services/` é a fronteira**: as chamadas HTTP (`services/BaseApi.ts` + por domínio) passam a
  envolver o `axios` com `catchError` e devolver `Result<T, E>`, em vez de deixar a exceção vazar.
- **Código novo nasce com `Result`** — sem `try/catch` cru nem `throw` solto. O legado migra
  incrementalmente, arquivo por arquivo (não é exceção permanente estilo `components/ui/*`).
- Erro sempre **tipado** (nunca `any`), casando com a fronteira de erro de
  [contracts.md](../architecture/contracts.md) e com [rust-rules.md](../architecture/rust-rules.md).
- Skill `catcher` instalada em `.agents/skills/catcher` (symlink em `.claude/skills/catcher`) como
  referência de API durante a implementação.

## Consequências

- `hooks/use-auth.tsx` e os `services/*.ts` são os primeiros candidatos à migração (hoje usam
  `try/catch` + relance). Enquanto o bypass de teste (`DEV_AUTH_BYPASS`) estiver ligado, a
  migração do auth espera.
- Dependência nova de terceiro: pacote pequeno e sem deps; reavaliar se ficar sem manutenção.
- Um ponto a decidir na implementação: padronizar o tipo de erro do cliente (ex.: um `ApiError`
  de frontend derivado da resposta `{code, message}` do backend) para preencher o `E` do `Result`.

## Status

Aceita. Migração pendente (lib e skill já instaladas; nenhuma chamada migrada ainda).
