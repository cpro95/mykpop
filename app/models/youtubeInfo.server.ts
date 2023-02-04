import type { YoutubeInfo } from "@prisma/client";

import { prisma } from "~/utils/db.server";
import { getYoutubeApiInfoById } from "./youtubeApi.server";

export function getYoutubeInfoByVideoId(videoId: string) {
  return prisma.youtubeInfo.findFirst({
    where: { videoId },
  });
}

export async function createYoutubeInfo(videoId: string, youtubeId: string) {
  const currentYoutubeInfo = await getYoutubeApiInfoById(youtubeId);

  return prisma.youtubeInfo.create({
    data: {
      youtubeId,
      youtubeTitle: currentYoutubeInfo.youtubeTitle,
      youtubeDescription: currentYoutubeInfo.youtubeDescription,
      youtubePublishedAt: currentYoutubeInfo.youtubePublishedAt,
      youtubeThumbnail: currentYoutubeInfo.youtubeThumbnail,
      youtubeViewCount: currentYoutubeInfo.youtubeViewCount,
      youtubeLikeCount: currentYoutubeInfo.youtubeLikeCount,
      youtubeCommentCount: currentYoutubeInfo.youtubeCommentCount,
      video: {
        connect: {
          id: videoId,
        }
      }
    },
  });
}

export async function updateYoutubeInfo(
  youtubeInfoId: string, youtubeId: string
) {
  const currentYoutubeInfo = await getYoutubeApiInfoById(youtubeId);

  return prisma.youtubeInfo.update({
    where: { id: youtubeInfoId },
    data: {
      youtubeThumbnail: currentYoutubeInfo.youtubeThumbnail,
      youtubeViewCount: currentYoutubeInfo.youtubeViewCount,
      youtubeLikeCount: currentYoutubeInfo.youtubeLikeCount,
      youtubeCommentCount: currentYoutubeInfo.youtubeCommentCount,
    },
  });
}

// export function deleteNote({
//   id,
//   userId,
// }: Pick<Note, "id"> & { userId: User["id"] }) {
//   return prisma.note.deleteMany({
//     where: { id, userId },
//   });
// }

export async function getYoutubeInfos(videoId: string) {
  const data = await prisma.youtubeInfo.findMany({
    where: { videoId },
  });

  // console.log(data);
  return data[0];
}

export async function getYoutubeApiInfosByIdArray(allVideos: Array<{ id: string }>) {
  console.log(allVideos);
  let youtubeInfos: Array<YoutubeInfo>;

  youtubeInfos = await Promise.all(
    allVideos.map(
      async (item): Promise<YoutubeInfo> => await getYoutubeInfos(item.id)
    )
  );

  youtubeInfos.sort((a, b) => {
    if (a.youtubePublishedAt < b.youtubePublishedAt) {
      return 1;
    }
    if (a.youtubePublishedAt > b.youtubePublishedAt) {
      return -1;
    }
    // a must be equal to b
    return 0;
  });

  return youtubeInfos;
}

export async function getYoutubeInfoCount() {
  return prisma.youtubeInfo.count();
}
