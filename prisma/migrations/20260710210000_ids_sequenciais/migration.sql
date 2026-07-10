-- DropForeignKey
ALTER TABLE "clientes" DROP CONSTRAINT "clientes_criado_por_fkey";

-- DropForeignKey
ALTER TABLE "interacoes" DROP CONSTRAINT "interacoes_autor_id_fkey";

-- DropForeignKey
ALTER TABLE "interacoes" DROP CONSTRAINT "interacoes_cliente_id_fkey";

-- AlterTable
ALTER TABLE "clientes" DROP CONSTRAINT "clientes_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "criado_por",
ADD COLUMN     "criado_por" INTEGER,
ADD CONSTRAINT "clientes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "interacoes" DROP CONSTRAINT "interacoes_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "cliente_id",
ADD COLUMN     "cliente_id" INTEGER NOT NULL,
DROP COLUMN "autor_id",
ADD COLUMN     "autor_id" INTEGER,
ADD CONSTRAINT "interacoes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "interacoes_cliente_id_idx" ON "interacoes"("cliente_id");

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interacoes" ADD CONSTRAINT "interacoes_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interacoes" ADD CONSTRAINT "interacoes_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

