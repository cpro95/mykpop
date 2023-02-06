import { useLoaderData, useSearchParams } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useRecoilState } from "recoil";
import { modalState, videoState } from "~/atoms/modalAtom";
import {
  getAllYoutubeInfosByNone,
  getAllYoutubeInfosCountByNone,
} from "~/models/youtubeInfo.server";
import VideoCard from "~/components/videocard";
import YoutubeModal from "~/components/youtubemodal";
import SearchForm from "~/components/search-form";
import { getMyParams } from "~/utils/utils";
import MyPagination from "~/components/my-pagination";
import { ITEMSPERPAGE } from "~/utils/consts";
import type { gotParamsType } from "~/utils/types";

export async function loader({ request }: LoaderArgs) {
  // Parsing URL query
  const url = new URL(request.url);

  let q = url.searchParams.get("q") as string | null;
  let page = url.searchParams.get("page") as string | number | null;
  let itemsPerPage = url.searchParams.get("itemsPerPage") as
    | string
    | number
    | null;
  let sorting = url.searchParams.get("sorting") as string | null;
  if (q === null) q = "";
  if (page === null) page = 1;
  if (itemsPerPage === null) itemsPerPage = ITEMSPERPAGE;
  if (sorting === null) sorting = "date";

  const youtubeInfos = await getAllYoutubeInfosByNone(
    q,
    Number(page),
    Number(itemsPerPage),
    sorting
  );

  const totalVidoes = await getAllYoutubeInfosCountByNone(q);
  // console.log(youtubeInfos, totalVidoes);

  return json({ youtubeInfos, totalVidoes });
}

function MVHome() {
  const { youtubeInfos, totalVidoes } = useLoaderData<typeof loader>();

  const [myParams] = useSearchParams();
  const { q, page, itemsPerPage, sorting } = getMyParams(myParams);
  const gotParams: gotParamsType = { q, page, itemsPerPage, sorting };

  const [showModal, setShowModal] = useRecoilState(modalState);
  const [video, setVideo] = useRecoilState(videoState);

  return (
    <section className="flex flex-col items-center">
      <div className="w-full px-2 pb-4">
        <SearchForm method="get" action="" gotParams={gotParams} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {youtubeInfos &&
          youtubeInfos.map((mv: any) => (
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
        {showModal && <YoutubeModal />}
      </div>

      <MyPagination
        q={q}
        page={page}
        itemsPerPage={itemsPerPage}
        total_pages={Math.ceil(Number(totalVidoes) / itemsPerPage)}
        sorting={sorting}
      />
    </section>
  );
}

export default MVHome;
