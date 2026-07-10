-- CreateEnum
CREATE TYPE "ModuloSistema" AS ENUM ('ifood', 'orcamentos');

-- AlterTable
ALTER TABLE "clientes" ADD COLUMN     "modulos" "ModuloSistema"[];
