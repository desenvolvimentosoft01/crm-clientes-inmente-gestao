-- CreateEnum
CREATE TYPE "PlanoSistema" AS ENUM ('basico', 'intermediario', 'avancado');

-- AlterTable
ALTER TABLE "clientes" ADD COLUMN     "plano_sistema" "PlanoSistema" NOT NULL DEFAULT 'basico';
