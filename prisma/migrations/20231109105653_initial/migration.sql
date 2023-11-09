-- CreateTable
CREATE TABLE "Med" (
    "id" SERIAL NOT NULL,
    "chat_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "cron" TEXT NOT NULL,

    CONSTRAINT "Med_pkey" PRIMARY KEY ("id")
);
