import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { YoutubeInfo } from "@prisma/client";
import { useRecoilState } from "recoil";
import { modalState, videoState } from "~/atoms/modalAtom";
import YoutubeModal from "~/components/youtubemodal";
import { getYoutubeApiInfosByIdArray } from "~/models/youtubeInfo.server";
import { getVideoIdsByArtistId } from "~/models/video.server";
import VideoCard from "~/components/videocard";
import { sortYoutubeInfos } from "~/utils/youtubeApi.server";

export function headers() {
  return {
    "Cache-Control":
      "public, max-age=60, s-maxage=6000, stale-while-revalidate=600",
  };
}

export async function loader({ params }: LoaderArgs) {
  invariant(params.artistId, "artistId not found");

  const allVideos: Array<{ id: string }> = await getVideoIdsByArtistId(
    params.artistId
  );

  if (!allVideos) {
    return json({});
  }

  const youtubeInfos = await getYoutubeApiInfosByIdArray(allVideos);
  sortYoutubeInfos(youtubeInfos, "youtubeViewCount");

  return json(youtubeInfos);
}

export default function MVArtistDetailsPage() {
  const youtubeInfos = useLoaderData<Array<YoutubeInfo>>();
  // console.log(youtubeInfos);

  const [showModal, setShowModal] = useRecoilState(modalState);
  const [video, setVideo] = useRecoilState(videoState);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {youtubeInfos &&
          youtubeInfos.map((mv: any) => (
            <button
              type="button"
              onClick={() => {
                setShowModal(true);
                setVideo(mv);
              }}
              key={mv.videoId}
              className="cursor-pointer hover:scale-105 hover:shadow-2xl"
            >
              <VideoCard mv={mv} />
            </button>
          ))}
        {showModal && <YoutubeModal />}
      </div>
    </div>
  );
}
