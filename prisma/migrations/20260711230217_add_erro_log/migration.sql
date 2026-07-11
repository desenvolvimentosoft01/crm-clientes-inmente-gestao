-- CreateTable
CREATE TABLE "erros_log" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER,
    "cliente_site" TEXT,
    "mensagem" TEXT NOT NULL,
    "detalhe_tecnico" TEXT,
    "tela" TEXT,
    "tipo" TEXT,
    "usuario" TEXT,
    "ocorrido_em" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "erros_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "erros_log_cliente_id_idx" ON "erros_log"("cliente_id");

-- AddForeignKey
ALTER TABLE "erros_log" ADD CONSTRAINT "erros_log_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
