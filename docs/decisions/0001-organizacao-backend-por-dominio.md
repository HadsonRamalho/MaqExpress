# 0001 — Organização do backend por domínio, não por camada

## Contexto

O backend nasceu de um template ("Rust-Backend-Template") organizado **por camada**:
`controllers/`, `models/` e `routes/`, cada pasta com um arquivo por domínio
(`controllers/maquinas.rs`, `models/maquinas.rs`, `routes/maquinas.rs`, e assim para `empresas`,
`enderecos`, `solicitacoes`, `usuarios`, `relatorios`). Mexer em uma funcionalidade de um domínio
obriga a abrir três diretórios diferentes; o que muda junto está espalhado por arquivos que só se
relacionam pelo nome. Com a refatoração em curso, é o momento de decidir a raiz de diretório antes
de o código crescer mais.

## Alternativas

1. **Manter por camada.** Menor esforço imediato, familiar. Rejeitada: perpetua o espalhamento —
   toda mudança de domínio continua tocando `controllers/ + models/ + routes/`, e o acoplamento
   real (regra de negócio + acesso a banco + rota de um domínio) nunca fica visível na árvore de
   pastas.
2. **Por domínio, raiz por módulo.** `domain/<nome>/` com os arquivos de cada responsabilidade
   dentro (`controller.rs`, `model.rs`, `routes.rs`, `dto.rs` quando necessário). O nome do
   domínio é a pasta; a camada é o nome do arquivo. O transversal (erro, jwt, validadores, utils)
   sai para `shared/`.

## Decisão

Alternativa 2. Estrutura alvo:

```
src/
  domain/{usuarios,enderecos,empresas,maquinas,solicitacoes,relatorios}/
    mod.rs  controller.rs  model.rs  routes.rs  [dto.rs]
  shared/   error.rs  jwt.rs  validadores.rs  utils.rs
  schema.rs  main.rs
```

Migração **incremental, um domínio por PR**, não big-bang. O primeiro passo é **co-locar por
domínio** o que hoje está por camada, preservando comportamento — mover arquivo e corrigir
`mod`/imports, com `cargo check` e `cargo test` verdes antes e depois. O split mais profundo
(service/repository separados do model, DTO sempre distinto da entity) é evolução posterior, não
pré-requisito desta decisão.

## Consequências

- Alterar um domínio passa a tocar **uma** pasta. Arquivo grande por domínio quebra por
  responsabilidade dentro da própria pasta.
- `shared/` concentra o que é genuinamente transversal; nada de domínio mora lá.
- `schema.rs` continua gerado pelo Diesel na raiz de `src/` — não entra em `domain/`.
- Os imports internos mudam em massa (`crate::controllers::maquinas` → `crate::domain::maquinas::controller`).
  Como não há `cargo` disponível no ambiente onde a reorganização foi feita, cada passo precisa de
  `cargo check`/`cargo test` na máquina do dev antes de considerar o PR fechado.
- Ponto de partida para as demais dívidas de [rust-rules.md](../architecture/rust-rules.md) (erro
  estruturado, DTO vs entity): a casa organizada por domínio é onde elas passam a caber.

## Status

Aceita.
