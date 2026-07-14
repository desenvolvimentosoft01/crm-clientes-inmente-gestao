-- AlterTable
ALTER TABLE "erros_log" ADD COLUMN     "resolvido" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resolvido_em" TIMESTAMP(3);
