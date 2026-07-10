-- CreateEnum
CREATE TYPE "PlanoContrato" AS ENUM ('free', 'mensal', 'anual');

-- AlterTable: converte a coluna "plano" (texto livre) para o enum, preservando valores existentes
ALTER TABLE "clientes" ADD COLUMN "plano_novo" "PlanoContrato";

UPDATE "clientes"
SET "plano_novo" = CASE
  WHEN upper("plano") = 'FREE' THEN 'free'::"PlanoContrato"
  WHEN upper("plano") = 'MENSAL' THEN 'mensal'::"PlanoContrato"
  WHEN upper("plano") = 'ANUAL' THEN 'anual'::"PlanoContrato"
  ELSE NULL
END;

ALTER TABLE "clientes" DROP COLUMN "plano";
ALTER TABLE "clientes" RENAME COLUMN "plano_novo" TO "plano";
