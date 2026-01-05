-- CreateEnum
CREATE TYPE "SecurityAction" AS ENUM ('LOGIN', 'REGISTER', 'PASSWORD_CHANGE', 'FAILED_LOGIN', 'ACCESS_DENIED', 'ADMIN_ACTION');

-- CreateTable
CREATE TABLE "SecurityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" "SecurityAction" NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SecurityLog_pkey" PRIMARY KEY ("id")
);
