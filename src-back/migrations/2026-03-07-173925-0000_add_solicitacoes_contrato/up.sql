-- Your SQL goes here
CREATE TABLE solicitacoes_contrato(
    "id" UUID NOT NULL PRIMARY KEY,
    "id_publico" INT4 NOT NULL,
    "id_maquina" UUID NOT NULL,
    "id_usuario_solicitante" UUID NOT NULL,
    "status" VARCHAR(32) NOT NULL,
    "data_inicio" TIMESTAMP NOT NULL,
    "data_fim" TIMESTAMP NOT NULL,
    "data_criacao" TIMESTAMP NOT NULL,
    "data_atualizacao" TIMESTAMP NOT NULL,
    FOREIGN KEY ("id_maquina") REFERENCES "maquinas"("id"),
    FOREIGN KEY ("id_usuario_solicitante") REFERENCES "usuarios"("id")
);

CREATE TABLE contratos(
    "id" UUID NOT NULL PRIMARY KEY,
    "id_solicitacao" UUID NOT NULL,
    "caminho_arquivo" VARCHAR(255) NOT NULL,
    "data_geracao" TIMESTAMP NOT NULL,
    FOREIGN KEY ("id_solicitacao") REFERENCES "solicitacoes_contrato"("id")
);
