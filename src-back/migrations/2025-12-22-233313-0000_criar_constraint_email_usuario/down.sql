-- This file should undo anything in `up.sql`
ALTER TABLE usuarios
DROP CONSTRAINT usuarios_email_unique;
