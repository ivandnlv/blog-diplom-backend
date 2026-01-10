-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "contentImagesUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "thumbnailUrl" TEXT;
