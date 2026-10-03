## Resumo

<!-- O que muda e por quê, em duas ou três linhas. -->

## Como testar

<!-- Passos para verificar na prática. -->

## Checklist

- [ ] Frontend: rodei o lint e a checagem de tipos localmente
- [ ] Rust: rodei `cargo fmt --check` e `cargo clippy -- -D warnings` no que toquei
- [ ] Rust: `cargo test` verde (com Postgres de teste, se o PR toca banco)
- [ ] Migration (se houver) tem `down.sql` com a destrutividade declarada no cabeçalho e `up.sql` idempotente
- [ ] `schema.rs` regenerado com `diesel print-schema` e commitado, se alguma migration mudou
- [ ] Nenhum detalhe de infraestrutura (mensagem de driver, nome de constraint) vaza no corpo de erro 5xx
- [ ] Nenhum segredo em variável `NEXT_PUBLIC_*`
- [ ] Reorganização por domínio: comportamento inalterado, `cargo check`/`cargo test` verdes
