-- Your SQL goes here
CREATE TABLE "usuarios"(
	"id" UUID NOT NULL PRIMARY KEY,
	"id_publico" INT4 NOT NULL,
	"nome" VARCHAR(128) NOT NULL,
	"email" VARCHAR(64) NOT NULL,
	"cpf" VARCHAR(32) NOT NULL,
	"senha" VARCHAR(128) NOT NULL,
	"tipo_login" VARCHAR(16) NOT NULL,
	"tipo_usuario" VARCHAR(16) NOT NULL,
	"ativo" BOOL NOT NULL,
	"data_cadastro" TIMESTAMP NOT NULL,
	"data_atualizacao" TIMESTAMP NOT NULL,
	"data_delecao" TIMESTAMP
);

CREATE TABLE "enderecos"(
	"id" UUID NOT NULL PRIMARY KEY,
	"id_usuario" UUID NOT NULL,
	"cep" VARCHAR(16) NOT NULL,
	"logradouro" VARCHAR(128) NOT NULL,
	"bairro" VARCHAR(64) NOT NULL,
	"cidade" VARCHAR(64) NOT NULL,
	"numero" VARCHAR(16) NOT NULL,
	"complemento" VARCHAR(64),
	"data_cadastro" TIMESTAMP NOT NULL,
	FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id")
);

