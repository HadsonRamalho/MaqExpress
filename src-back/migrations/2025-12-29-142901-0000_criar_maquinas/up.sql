-- Your SQL goes here
CREATE TABLE maquinas(
    "id" UUID NOT NULL PRIMARY KEY,
	"id_publico" INT4 NOT NULL,
	"id_usuario" UUID,
	"id_empresa" UUID,
	"nome" VARCHAR(128) NOT NULL,
	"descricao" TEXT NOT NULL,
	"numero_serie" VARCHAR(128) NOT NULL,
	"ativo" BOOL NOT NULL,
	"data_cadastro" TIMESTAMP NOT NULL,
	"data_atualizacao" TIMESTAMP NOT NULL,
	"data_delecao" TIMESTAMP
);
