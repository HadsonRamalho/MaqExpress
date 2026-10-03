# Testes

## Ferramentas 🔴

**`#[cfg(test)]`** no Rust — zero dependência nova. O backend já tem `src/tests/` com
`e2e.rs`, `usuarios.rs`, `utils.rs` e `mod.rs`. **Vitest** no frontend quando a primeira suíte de
TS existir (ESM nativo, sem transpilação extra; `@testing-library/react` quando alcançar
componente). Hoje o frontend **não tem** suíte nem script `test` em `package.json` — montar isso é
parte da refatoração.

## Quando uma suíte é obrigatória 🔴

Só quando um **módulo de domínio** é criado ou tocado — não existe piso percentual de cobertura.
Partindo de uma base ampla sem teste, um mínimo arbitrário incentivaria testar o fácil em vez do
que importa. Componente de UI **nunca** é obrigado a ter suíte.

Áreas de maior consequência no MaqExpress, onde a suíte vem primeiro:

- **Autenticação** — `controllers/jwt.rs`, login/validação de token.
- **Solicitação → contrato** — `controllers/solicitacoes.rs` + geração de PDF (`printpdf`): é o
  fluxo de negócio central, e o `plan.md` quer medir e comparar o tempo dele.
- **Validadores** — `controllers/validadores.rs` (`Sanitize`/`Texto`): borda de entrada de dado.

## Como uma suíte é escrita 🔴

Cobre caminho feliz **e** caminho de exceção — erro, vazio, não-encontrado — sempre que ambos
existirem no módulo. Suíte que só testa o caminho feliz dá sensação de segurança sem pegar o bug
que motivou o teste.

## Rede de teste antes de reorganização 🔴

Nenhuma refatoração estrutural grande (mover diretório, reorganizar o backend por domínio)
acontece sobre código sem nenhuma cobertura no que ela toca. A suíte `e2e.rs`/`usuarios.rs`
existente é a rede mínima para a reorganização por domínio; onde ela não cobre, a reorganização
deve ser conservadora (mover arquivo e ajustar `mod`/imports, sem mudar comportamento) e validada
com `cargo test` + `cargo check`.

## `cargo test` depende de Postgres real 🟡

Os testes e2e precisam de um Postgres com `TEST_DATABASE_URL` (ver
[env-vars.md](env-vars.md)). Sem o banco, um teste de integração pode passar sem verificar nada —
se um teste de DB parece passar rápido demais, confira se o serviço está configurado no job de CI
(`.github/workflows/ci.yml`).

## Mudou X ⇒ verifique Y

- Módulo de domínio novo ou tocado ⇒ pergunte se cai numa das áreas de maior consequência
  (autenticação, contrato/PDF, validação) antes de decidir que a suíte pode esperar.
- Reorganização por domínio ⇒ `cargo test` + `cargo check` verdes antes e depois; a estrutura
  muda, o comportamento não.
- Teste de integração novo ⇒ confirme que roda contra Postgres real no CI, não só compila.
