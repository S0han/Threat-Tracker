-- CreateTable
CREATE TABLE "Threat" (
    "id" SERIAL NOT NULL,
    "host" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "threat_type" TEXT NOT NULL,
    "date_added" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Threat_pkey" PRIMARY KEY ("id")
);
