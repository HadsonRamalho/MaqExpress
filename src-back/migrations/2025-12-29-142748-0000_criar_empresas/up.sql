-- Your SQL goes here
CREATE TABLE empresas(
    "id" UUID NOT NULL PRIMARY KEY,
    "id_publico" INT4 NOT NULL,
    "id_usuario" UUID NOT NULL,
    "nome" VARCHAR(128) NOT NULL,
    "cnpj" VARCHAR(32) NOT NULL,
    "ativo" BOOL NOT NULL,
    "data_cadastro" TIMESTAMP NOT NULL,
    "data_atualizacao" TIMESTAMP NOT NULL,
    "data_delecao" TIMESTAMP,
    FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id")
);
