-- CreateTable
CREATE TABLE "Show" (
    "id" SERIAL NOT NULL,
    "contratanteId" INTEGER NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_show" TIMESTAMP(3) NOT NULL,
    "horario_show" TIMESTAMP(3) NOT NULL,
    "local" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "custo" DOUBLE PRECISION,
    "status" BOOLEAN NOT NULL,
    "descricao" TEXT,
    "valor_caixa" DOUBLE PRECISION,

    CONSTRAINT "Show_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Musico" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT,
    "instrumento" TEXT NOT NULL,
    "funcao" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "cache_medio" DOUBLE PRECISION,
    "pix" TEXT,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Musico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contratante" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "contato" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT,
    "endereco" TEXT,
    "telefone" TEXT NOT NULL,
    "email" TEXT,
    "tipo" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contratante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShowMusico" (
    "id" SERIAL NOT NULL,
    "showId" INTEGER NOT NULL,
    "musicoId" TEXT NOT NULL,

    CONSTRAINT "ShowMusico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Musico_username_key" ON "Musico"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ShowMusico_showId_musicoId_key" ON "ShowMusico"("showId", "musicoId");

-- AddForeignKey
ALTER TABLE "Show" ADD CONSTRAINT "Show_contratanteId_fkey" FOREIGN KEY ("contratanteId") REFERENCES "Contratante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowMusico" ADD CONSTRAINT "ShowMusico_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowMusico" ADD CONSTRAINT "ShowMusico_musicoId_fkey" FOREIGN KEY ("musicoId") REFERENCES "Musico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
