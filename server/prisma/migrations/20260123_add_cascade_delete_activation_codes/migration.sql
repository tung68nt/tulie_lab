-- Add CASCADE DELETE to ActivationCode.orderId foreign key
ALTER TABLE "ActivationCode" DROP CONSTRAINT IF EXISTS "ActivationCode_orderId_fkey";

ALTER TABLE "ActivationCode"
ADD CONSTRAINT "ActivationCode_orderId_fkey"
FOREIGN KEY ("orderId")
REFERENCES "Order"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
