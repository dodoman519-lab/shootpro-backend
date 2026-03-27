-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "clientAddress" TEXT,
ADD COLUMN     "eventTime" TEXT,
ADD COLUMN     "eventType" TEXT,
ADD COLUMN     "proAddress" TEXT,
ADD COLUMN     "proName" TEXT;

-- AlterTable
ALTER TABLE "ProProfile" ADD COLUMN     "customPrice" INTEGER,
ADD COLUMN     "customService" TEXT,
ADD COLUMN     "photoUrl4" TEXT,
ADD COLUMN     "photoUrl5" TEXT,
ADD COLUMN     "photoUrl6" TEXT;

-- DropTable
DROP TABLE "immo_states";

-- DropTable
DROP TABLE "immo_users";

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "proName" TEXT NOT NULL,
    "proPrenom" TEXT NOT NULL,
    "proAddress" TEXT NOT NULL,
    "proSiret" TEXT,
    "proTva" TEXT,
    "proEmail" TEXT,
    "clientName" TEXT NOT NULL,
    "clientAddress" TEXT NOT NULL,
    "clientEmail" TEXT,
    "lines" TEXT NOT NULL,
    "tvaRate" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "notes" TEXT,
    "paymentTerms" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

