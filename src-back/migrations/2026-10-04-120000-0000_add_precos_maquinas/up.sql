-- Preços da máquina em centavos de BRL (evita imprecisão de ponto flutuante).
-- `preco_diaria` é obrigatório; semanal/mensal são opcionais (planos alternativos).
ALTER TABLE maquinas
    ADD COLUMN "preco_diaria" BIGINT NOT NULL DEFAULT 0,
    ADD COLUMN "preco_semanal" BIGINT,
    ADD COLUMN "preco_mensal" BIGINT;
