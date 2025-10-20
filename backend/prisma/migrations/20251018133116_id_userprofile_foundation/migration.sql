-- AlterTable
ALTER TABLE "foundation" ADD COLUMN     "logoPublicId" VARCHAR(255),
ALTER COLUMN "logo_url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user_profile" ADD COLUMN     "publicId" TEXT;
