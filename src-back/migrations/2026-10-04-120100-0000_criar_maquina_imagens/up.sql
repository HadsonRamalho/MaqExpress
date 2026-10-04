-- Imagens de uma máquina. Guarda apenas metadados/URL; o armazenamento do
-- binário (Supabase Storage) é um passo posterior do MVP. `ON DELETE CASCADE`
-- para que remover a máquina limpe as imagens associadas.
CREATE TABLE maquina_imagens(
    "id" UUID NOT NULL PRIMARY KEY,
    "id_maquina" UUID NOT NULL,
    "url" VARCHAR(512) NOT NULL,
    "ordem" INT4 NOT NULL DEFAULT 0,
    "principal" BOOL NOT NULL DEFAULT FALSE,
    "data_cadastro" TIMESTAMP NOT NULL,
    FOREIGN KEY ("id_maquina") REFERENCES "maquinas"("id") ON DELETE CASCADE
);

CREATE INDEX idx_maquina_imagens_id_maquina ON maquina_imagens ("id_maquina");
