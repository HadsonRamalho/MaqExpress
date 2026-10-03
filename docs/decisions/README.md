# ADRs — Architecture Decision Records

Decisão com **alternativas reais** vira um ADR aqui; regra operacional do dia a dia vira doc em
[../architecture/](../architecture/). Um ADR é imutável depois de aceito — muda-se de ideia com um
ADR novo que supersede o anterior, não editando o antigo.

## Formato

Cada ADR tem cinco seções, nesta ordem:

1. **Contexto** — o que forçou a decisão.
2. **Alternativas** — as opções reais consideradas, com o motivo de cada rejeição.
3. **Decisão** — o que foi escolhido.
4. **Consequências** — o que passa a ser verdade (bom e ruim) por causa da escolha.
5. **Status** — `Proposta` | `Aceita` | `Superseded por NNNN`.

Nome do arquivo: `NNNN-titulo-curto-em-kebab.md`, `NNNN` sequencial de quatro dígitos.

## Índice

| ADR | Título | Status |
|---|---|---|
| [0001](0001-organizacao-backend-por-dominio.md) | Organização do backend por domínio, não por camada | Aceita |
| [0006](0006-tratamento-de-erro-frontend-catcher.md) | Tratamento de erro no frontend com `@catcherjs/core` | Aceita |
