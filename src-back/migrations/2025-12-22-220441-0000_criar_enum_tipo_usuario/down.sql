-- This file should undo anything in `up.sql`
ALTER TABLE usuarios ALTER COLUMN tipo_usuario TYPE VARCHAR;
DROP TYPE IF EXISTS tipo_usuario;
