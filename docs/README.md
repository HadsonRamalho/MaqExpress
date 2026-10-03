# MaqExpress — Documentação normativa

Índice dos documentos que regem como o código do MaqExpress é escrito. Cada um cobre um tema;
juntos, são a referência a citar em review. Foram portados e adaptados do projeto
`zeile-notebook` (mesma stack: Next.js + Rust/Diesel) para a realidade atual deste repositório.

## Regra de precedência

**A regra documentada vence o padrão do arquivo vizinho.** Se o código em volta viola uma
regra, siga a regra — não imite a violação. Um mau exemplo presente no contexto não autoriza
reproduzi-lo. Como o MaqExpress está em refatoração, boa parte do código atual **ainda não é
conforme**: cada doc marca as divergências reais como **dívida conhecida**, com o arquivo
exato onde ela vive. Essa lista de dívidas é, na prática, o backlog da refatoração.

Quando dois documentos parecem se sobrepor, o mais específico ao tema vence (ex.:
`contracts.md` sobre casing de campo serializado vence `code-rules.md` sobre naming genérico).

## Severidade

Toda regra nasce com um nível:

- 🔴 **bloqueante** — deve falhar review ou CI; não se mescla enquanto viola.
- 🟡 **corrigir** — não bloqueia o PR atual, mas é dívida declarada; corrige-se na próxima vez
  que o arquivo for tocado.
- ⚪ **sugestão** — preferência registrada, sem enforcement.

> Nota de estado: o enforcement automático (CI, git hook) está sendo montado junto com a
> refatoração. Onde uma regra 🔴 ainda não tem guard, o doc escreve **"enforcement pendente"**.
> Até lá a regra vale em review humano.

## Idioma do projeto

O MaqExpress é um projeto em **pt-BR**: comentários, identificadores de domínio e mensagens já
são em português, e assim seguem. Isso é uma escolha deliberada, não dívida — ver
[architecture/comment-guide.md](architecture/comment-guide.md). (Diferença consciente em
relação ao Zeile, que reverteu para en-US por mirar contribuição externa.)

## Índice

| Documento | Tema |
|---|---|
| [architecture/comment-guide.md](architecture/comment-guide.md) | Quando comentar, em que idioma, como referenciar coisa externa |
| [architecture/code-rules.md](architecture/code-rules.md) | Naming, tamanho de arquivo/função, um componente por arquivo, tipos por domínio |
| [architecture/frontend-rules.md](architecture/frontend-rules.md) | `app/` vs `components/` vs `services/`; fronteiras de import; tsconfig e lint estritos |
| [architecture/rust-rules.md](architecture/rust-rules.md) | Camadas do backend (`controllers`/`models`/`routes`), erro estruturado, extractors, clippy |
| [architecture/contracts.md](architecture/contracts.md) | Fronteira Rust → TypeScript via OpenAPI (`utoipa`), casing, "um conceito uma grafia" |
| [architecture/database.md](architecture/database.md) | Migrations Diesel, `up`/`down`, `timestamptz`, idempotência, erro mapeado por causa |
| [architecture/security.md](architecture/security.md) | Segredos e env, CORS, body limit, rate limit, erro 5xx sem vazamento |
| [architecture/operability.md](architecture/operability.md) | Health checks, erro de boot, timeouts de I/O externo, shutdown gracioso |
| [architecture/testing.md](architecture/testing.md) | Quando uma suíte é obrigatória e como escrevê-la (`#[cfg(test)]` Rust, Vitest front) |
| [architecture/env-vars.md](architecture/env-vars.md) | Toda variável de ambiente do projeto, pública/secreta, obrigatória/opcional |
| [decisions/](decisions/) | ADRs — Contexto / Alternativas / Decisão / Consequências / Status |

## "Mudou X ⇒ verifique Y"

Cada doc de `architecture/` termina com uma seção curta apontando os pontos de acoplamento
reais do MaqExpress — o que mais tocar quando aquele tema muda. É o substituto barato de um
checklist automatizado de revisão: em vez de um agente lendo o diff, um humano lê a seção certa.
