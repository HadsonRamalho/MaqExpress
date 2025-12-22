-- Your SQL goes here
ALTER TABLE usuarios
ADD CONSTRAINT usuarios_email_unique UNIQUE (email);
