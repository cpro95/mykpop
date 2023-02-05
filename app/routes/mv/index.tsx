import { useLoaderData } from "@remix-run/react";
import type { YoutubeInfo } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useRecoilState } from "recoil";
import { modalState, videoState } from "~/atoms/modalAtom";
import { getAllVideoIds } from "~/models/video.server";
import { getYoutubeApiInfosByIdArray } from "~/models/youtubeInfo.server";
import { sortYoutubeInfos } from "~/utils/youtubeApi.server";
import VideoCard from "~/components/videocard";
import YoutubeModal from "~/components/youtubemodal";

export async function loader({ request }: LoaderArgs) {
  const allVideos = await getAllVideoIds("", 1, 10000);

  if (!allVideos) {
    return json({});
  }

  let youtubeInfos = await getYoutubeApiInfosByIdArray(allVideos);
  sortYoutubeInfos(youtubeInfos, "youtubeViewCount");

  return json(youtubeInfos);
}

function MVHome() {
  const mvData = useLoaderData<Array<YoutubeInfo>>();

  // console.log(mvData);

  const [showModal, setShowModal] = useRecoilState(modalState);
  const [video, setVideo] = useRecoilState(videoState);

  return (
    <section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {mvData &&
          mvData.map((mv: any) => (
            <button
              type="button"
              onClick={() => {
                setShowModal(true);
                setVideo(mv);
              }}
              key={mv.id}
              className="cursor-pointer hover:scale-105 hover:shadow-2xl"
            >
              <VideoCard mv={mv} />
            </button>
          ))}
      </div>

      {showModal && <YoutubeModal />}
    </section>
  );
}

export default MVHome;
