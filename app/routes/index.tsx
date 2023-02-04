import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getAllVideoIds } from "~/models/video.server";
import { modalState, videoState } from "~/atoms/modalAtom";
import { useRecoilState } from "recoil";
import Modal from "~/components/modal";
import { Layout } from "~/components/layout";
import { getYoutubeApiInfosByIdArray } from "~/models/youtubeInfo.server";
import type { YoutubeInfo } from "@prisma/client";

export function headers() {
  return {
    "Cache-Control":
      "public, max-age=60, s-maxage=6000, stale-while-revalidate=600",
  };
}

export const meta: MetaFunction = () => {
  return {
    title: "All About KPop",
    description: "KPop의 모든 것, All About KPop",
  };
};

export async function loader({ request }: LoaderArgs) {
  const allVideos = await getAllVideoIds("", 1, 4);

  if (!allVideos) {
    return json({});
  }

  const youtubeInfos = await getYoutubeApiInfosByIdArray(allVideos);

  return json(youtubeInfos);
}

function Home() {
  const mvData = useLoaderData<Array<YoutubeInfo>>();

  // console.log(mvData);

  const [showModal, setShowModal] = useRecoilState(modalState);
  const [video, setVideo] = useRecoilState(videoState);

  return (
    <Layout title="Home" linkTo="/">
      <section className="flex justify-center">
        {/* Popular Movies */}
        <div className="flex w-full flex-col p-4 lg:w-10/12">
          <h1 className="mb-2 text-2xl font-bold dark:text-white">
            Popular MVs
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
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
                  <div className="mx-auto max-w-xs overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
                    {mv.youtubeThumbnail && (
                      <img
                        className="w-full object-cover"
                        src={mv.youtubeThumbnail}
                        alt={mv.youtubeTitle}
                      />
                    )}

                    <div className="h-28 py-5 text-center">
                      <p className="block text-lg font-semibold text-gray-800 dark:text-white">
                        {mv.youtubeTitle}
                      </p>
                      <span className="text-xs text-gray-700 dark:text-gray-200">
                        {new Date(mv.youtubePublishedAt).toLocaleDateString(
                          "ko-Kr"
                        )}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
          </div>

          {showModal && <Modal />}
        </div>
      </section>
    </Layout>
  );
}

export default Home;
