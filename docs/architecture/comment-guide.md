# Comentários

## Idioma 🔴

Comentário, identificador de domínio, mensagem de log e texto de erro (`ApiError`) são todos em
**pt-BR**. O MaqExpress já é escrito assim ("Servidor rodando na porta", `ApiError::EmailNotFound`
com mensagem em português) e a escolha é deliberada: o projeto é mantido em português e não mira
contribuição externa anônima.

Termos técnicos sem tradução natural (`token`, `pool`, `endpoint`, `handler`, `commit`) ficam em
inglês dentro do texto pt-BR — é o uso corrente, não exceção a registrar.

## Quando comentar 🟡

Comentário só se justifica por caber numa das seis categorias abaixo. Fora delas, o comentário
não existe — nome de identificador bem escolhido já é a documentação.

1. **Implementação de padrão externo**, com referência perene (ver "Como referenciar" abaixo).
2. **Trade-off de performance medido** — não intuição, número. "Trocado por X porque Y era N×
   mais lento" exige que N tenha vindo de uma medição real, citada ou reproduzível. (O
   `src-back/plan.md` fala em medir tempo de geração de PDF vs. processo manual — esse é
   exatamente o tipo de número que justifica um comentário.)
3. **Invariante ou pré-condição não local** — a garantia não é visível só lendo a função; quem
   editar precisa saber que quebrar aquilo tem efeito em outro lugar do código.
4. **Violação intencional de convenção** — por que este arquivo não segue o padrão que os
   vizinhos seguem.
5. **Regex ou operação bitwise não trivial** — o que o padrão captura, não a sintaxe.
6. **Decisão de UX/interação** — por que a interface se comporta assim e não do jeito óbvio.

Comentário que só repete o nome do identificador, ou que descreve o que a linha faz em vez do
porquê, não se encaixa em nenhuma categoria e não deve ser escrito.

## Como referenciar coisa externa 🔴

Ao comentar comportamento de biblioteca externa (Diesel, Axum, `jsonwebtoken`, `printpdf`,
`web-push`, `axios`), a citação precisa de:

- **Link permanente** — DOI, número de RFC, URL arquivada ou versão fixada da doc (não uma URL
  que pode sair do ar ou mudar de conteúdo).
- **Nunca** referência a PR, issue ou commit deste repositório — o Git já guarda essa história;
  comentário que aponta para ela fica obsoleto no primeiro rebase ou squash.

ADR (`docs/decisions/`) conta como referência legítima: é versionada e perene.

## Mudou X ⇒ verifique Y

- Comentário que só repete o código sobrevivente num arquivo tocado ⇒ remova no mesmo PR.
- Import de biblioteca externa nova com comportamento não óbvio ⇒ considere se o comentário
  categoria 1 (padrão externo) se aplica antes de deixar a lib "falar por si".
- Número de performance citado sem fonte ⇒ ou vira medição reproduzível, ou o comentário sai.
