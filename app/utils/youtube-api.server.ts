import { getRequiredServerEnvVar } from "./utils";

export type YoutubeApiInfo = {
  youtubeId: string;
  youtubePublishedAt: Date;
  youtubeTitle: string;
  youtubeDescription: string;
  youtubeThumbnail: string;
  youtubeViewCount: number;
  youtubeLikeCount: number;
  youtubeCommentCount: number;
};

const BASE_URL = getRequiredServerEnvVar("YOUTUBE_BASE_URL")

export async function getYoutubeApiInfoById(youtubeId: string) {
  const result = await fetch(
    `${BASE_URL}/videos?id=${youtubeId}&key=${process.env.YOUTUBE_API_KEY}&part=sni%20%20%20%20ppet,statistics&fields=items(id,snippet,statistics)`
  );

  const youtube = await result.json();
  // console.log("youtube is");
  // console.log(youtube.items[0].snippet);
  // console.log(youtube.items[0].statistics);

  let youtubeInfo: YoutubeApiInfo;
  if (youtube.items.length === 0) {
    console.log("No Video");
    youtubeInfo = {
      youtubeId: "",
      youtubePublishedAt: new Date(),
      youtubeTitle: "",
      youtubeDescription: "",
      youtubeThumbnail: "",
      youtubeViewCount: 0,
      youtubeLikeCount: 0,
      youtubeCommentCount: 0,
    };
  } else {
    youtubeInfo = {
      youtubeId: youtubeId,
      youtubePublishedAt: youtube.items[0].snippet.publishedAt,
      youtubeTitle: youtube.items[0].snippet.title,
      youtubeDescription: youtube.items[0].snippet.description,
      youtubeThumbnail: youtube.items[0].snippet.thumbnails.standard.url,
      youtubeViewCount: parseInt(youtube.items[0].statistics.viewCount),
      youtubeLikeCount: parseInt(youtube.items[0].statistics.likeCount),
      youtubeCommentCount: parseInt(youtube.items[0].statistics.commentCount),
    };
  }

  return youtubeInfo;
}

export function sortYoutubeInfos(youtubeInfos: any, which: string) {
  return youtubeInfos.sort((a: any, b: any) => {
    if (Number(a[which]) < Number(b[which])) {
      return 1;
    }
    if (Number(a[which]) > Number(b[which])) {
      return -1;
    }
    // a must be equal to b
    return 0;
  });
}
