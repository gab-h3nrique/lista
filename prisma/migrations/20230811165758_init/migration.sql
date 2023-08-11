-- CreateTable
CREATE TABLE "convidados" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "convidadoPor" TEXT,
    "grupo" TEXT,
    "confirmouPresenca" BOOLEAN NOT NULL DEFAULT false,
    "cor" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "convidados_pkey" PRIMARY KEY ("id")
);
