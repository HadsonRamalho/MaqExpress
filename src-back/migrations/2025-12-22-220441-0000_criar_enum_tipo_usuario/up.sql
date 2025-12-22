-- Your SQL goes here
CREATE TYPE tipo_usuario AS ENUM ('admin', 'usuario');

ALTER TABLE usuarios
ALTER COLUMN tipo_usuario TYPE tipo_usuario
USING tipo_usuario::tipo_usuario;
