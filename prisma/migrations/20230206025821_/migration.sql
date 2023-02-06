/*
  Warnings:

  - You are about to alter the column `youtubeCommentCount` on the `YoutubeInfo` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `youtubeLikeCount` on the `YoutubeInfo` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `youtubePublishedAt` on the `YoutubeInfo` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `youtubeViewCount` on the `YoutubeInfo` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_YoutubeInfo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "youtubeId" TEXT NOT NULL,
    "youtubeTitle" TEXT NOT NULL,
    "youtubeDescription" TEXT NOT NULL,
    "youtubePublishedAt" DATETIME NOT NULL,
    "youtubeThumbnail" TEXT NOT NULL,
    "youtubeViewCount" INTEGER NOT NULL,
    "youtubeLikeCount" INTEGER NOT NULL,
    "youtubeCommentCount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "videoId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    CONSTRAINT "YoutubeInfo_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "YoutubeInfo_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_YoutubeInfo" ("artistId", "createdAt", "id", "updatedAt", "videoId", "youtubeCommentCount", "youtubeDescription", "youtubeId", "youtubeLikeCount", "youtubePublishedAt", "youtubeThumbnail", "youtubeTitle", "youtubeViewCount") SELECT "artistId", "createdAt", "id", "updatedAt", "videoId", "youtubeCommentCount", "youtubeDescription", "youtubeId", "youtubeLikeCount", "youtubePublishedAt", "youtubeThumbnail", "youtubeTitle", "youtubeViewCount" FROM "YoutubeInfo";
DROP TABLE "YoutubeInfo";
ALTER TABLE "new_YoutubeInfo" RENAME TO "YoutubeInfo";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
