/*
  Warnings:

  - You are about to drop the column `youtubeFavoriteCount` on the `YoutubeInfo` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_YoutubeInfo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "youtubeId" TEXT NOT NULL,
    "youtubeTitle" TEXT NOT NULL,
    "youtubeDescription" TEXT NOT NULL,
    "youtubePublishedAt" TEXT NOT NULL,
    "youtubeThumbnail" TEXT NOT NULL,
    "youtubeViewCount" TEXT NOT NULL,
    "youtubeLikeCount" TEXT NOT NULL,
    "youtubeCommentCount" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "videoId" TEXT NOT NULL,
    CONSTRAINT "YoutubeInfo_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_YoutubeInfo" ("createdAt", "id", "updatedAt", "videoId", "youtubeCommentCount", "youtubeDescription", "youtubeId", "youtubeLikeCount", "youtubePublishedAt", "youtubeThumbnail", "youtubeTitle", "youtubeViewCount") SELECT "createdAt", "id", "updatedAt", "videoId", "youtubeCommentCount", "youtubeDescription", "youtubeId", "youtubeLikeCount", "youtubePublishedAt", "youtubeThumbnail", "youtubeTitle", "youtubeViewCount" FROM "YoutubeInfo";
DROP TABLE "YoutubeInfo";
ALTER TABLE "new_YoutubeInfo" RENAME TO "YoutubeInfo";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
