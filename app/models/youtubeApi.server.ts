export type YoutubeApiInfo = {
    youtubeId: string;
    youtubePublishedAt: string;
    youtubeTitle: string;
    youtubeDescription: string;
    youtubeThumbnail: string;
    youtubeViewCount: string;
    youtubeLikeCount: string;
    youtubeCommentCount: string;
};

const BASE_URL = 'https://www.googleapis.com/youtube/v3';


export async function getYoutubeApiInfoById(youtubeId: string) {
    const result = await fetch(`${BASE_URL}/videos?id=${youtubeId}&key=${process.env.YOUTUBE_API_KEY}&part=sni%20%20%20%20ppet,statistics&fields=items(id,snippet,statistics)`);

    const youtube = await result.json();
    // console.log("youtube is");
    // console.log(youtube.items[0].snippet);
    // console.log(youtube.items[0].statistics);

    let youtubeInfo: YoutubeApiInfo;
    if (youtube.items.length === 0) {
        console.log("No Video");
        youtubeInfo = {
            youtubeId: "",
            youtubePublishedAt: "",
            youtubeTitle: "",
            youtubeDescription: "",
            youtubeThumbnail: "",
            youtubeViewCount: "",
            youtubeLikeCount: "",
            youtubeCommentCount: "",
        };
    } else {
        youtubeInfo = {
            youtubeId: youtubeId,
            youtubePublishedAt: youtube.items[0].snippet.publishedAt,
            youtubeTitle: youtube.items[0].snippet.title,
            youtubeDescription: youtube.items[0].snippet.description,
            youtubeThumbnail: youtube.items[0].snippet.thumbnails.standard.url,
            youtubeViewCount: youtube.items[0].statistics.viewCount,
            youtubeLikeCount: youtube.items[0].statistics.likeCount,
            youtubeCommentCount: youtube.items[0].statistics.commentCount,
        };
    }

    // console.log(youtubeInfo);

    return youtubeInfo;
}


// no longer needed
// export async function getYoutubeApiInfos(allVideos: Array<{ id: string }>) {
//     let youtubeInfos: YoutubeApiInfo[];

//     youtubeInfos = await Promise.all(
//         allVideos.map(
//             (item: any): Promise<YoutubeApiInfo> =>
//                 getYoutubeApiInfoById(item.youtubeId)
//         )
//     );

//     youtubeInfos.sort((a, b) => {
//         if (a.youtubePublishedAt < b.youtubePublishedAt) {
//             return 1;
//         }
//         if (a.youtubePublishedAt > b.youtubePublishedAt) {
//             return -1;
//         }
//         // a must be equal to b
//         return 0;
//     });

//     return youtubeInfos
// }