# Naming, tamanho e granularidade

## Naming 🔴

- **Frontend — kebab-case para todo arquivo** `.ts`/`.tsx`, com sufixo de papel quando houver:
  `-service`, `-provider`, `use-` para hook. O MaqExpress já segue isso em `hooks/use-auth.tsx`,
  `components/theme-provider.tsx`. **Enforcement pendente**: `forceConsistentCasingInFileNames`
  **não** está ligado no `tsconfig.json` — ligar é dívida de [frontend-rules.md](frontend-rules.md).
- **Backend — snake_case** em arquivo, função e campo, como manda o Rust. Nome de arquivo = nome
  do domínio (`maquinas.rs`, `empresas.rs`), que após a reorganização por domínio vira o nome da
  pasta (ver [rust-rules.md](rust-rules.md) e [decisions/0001](decisions/0001-organizacao-backend-por-dominio.md)).
- **camelCase em função/variável TypeScript exportada**; PascalCase reservado para componente
  React, classe (`BaseApi`) e tipo/interface.
- **Sem prefixo `I` em interface.** `Usuario`, `Maquina`, `SolicitacaoContrato` — não `IUsuario`.
- **Um conceito, uma grafia**, entre TypeScript e Rust. Ver a regra completa e o alvo de
  enforcement em [contracts.md](contracts.md): nenhum campo do contrato deve conviver com duas
  grafias (ex.: `id_usuario` no Rust e `idUsuario` **e** `id_usuario` no TS).

## Tamanho 🟡 função / ⚪ arquivo

- 🟡 **Função com mais de 50 linhas** é candidata a quebra — corrigir quando o arquivo for
  tocado, não abrir PR só para isso.
- ⚪ **Arquivo com mais de 400 linhas** é sugestão de quebra, não bloqueio.

Nenhuma das duas é número absoluto: existe para sinalizar "olhe aqui", não para travar CI.
A reorganização do backend por domínio (quebrar `controllers/`/`models/` por responsabilidade)
é a oportunidade natural de aplicar isso ao Rust.

## Um componente público por arquivo 🟡 (frontend)

Um arquivo `.tsx` exporta **um** componente. Subcomponentes privados, usados só ali, podem morar
no mesmo arquivo sem exportação.

## Tipos agrupados por domínio coeso 🟡

Tipo fica junto do domínio a que pertence — nem um arquivo genérico com tudo, nem um arquivo por
tipo.

**Dívida conhecida**: `interfaces/index.ts` (145 linhas) é hoje um arquivo único com os tipos de
todos os domínios do frontend — o equivalente ao antipadrão `lib/types.ts` do Zeile. O destino é
quebrá-lo por domínio (e, melhor ainda, substituir pelos tipos **gerados** a partir do OpenAPI do
backend — ver [contracts.md](contracts.md)).

## Mudou X ⇒ verifique Y

- Arquivo novo no frontend ⇒ nome em kebab-case com o sufixo certo; se exporta componente, é o
  único componente público do arquivo.
- Struct Rust serializado ganhando `#[serde(rename)]` campo a campo ⇒ pare — é "um conceito, uma
  grafia" sendo violado; casing é decisão de `rename_all` no struct inteiro.
- Função passando de ~50 linhas no PR atual ⇒ considere quebrar antes de abrir o PR, não depois.
