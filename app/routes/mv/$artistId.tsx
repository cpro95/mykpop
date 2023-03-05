import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import invariant from "tiny-invariant";
import { useRecoilState } from "recoil";
import { modalState, videoState } from "~/atoms/modalAtom";
import YoutubeModal from "~/components/youtube-modal";
import {
  getAllYoutubeInfosByArtistId,
  getAllYoutubeInfosCountByArtistId,
} from "~/models/youtube-info.server";
import VideoCard from "~/components/video-card";
import SearchForm from "~/components/search-form";
import MyPagination from "~/components/my-pagination";
import { ITEMSPERPAGE } from "~/utils/consts";
import type { gotParamsType } from "~/utils/types";
import { getMyParams } from "~/utils/utils";

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.artistId, "artistId not found");

  // Parsing URL query
  const url = new URL(request.url);
  let q = url.searchParams.get("q") as string | null;
  let page = url.searchParams.get("page") as string | number | null;
  let itemsPerPage = url.searchParams.get("itemsPerPage") as
    | string
    | number
    | null;
  let sorting = url.searchParams.get("sorting") as string | null;
  let role = url.searchParams.get("role") as string | null;

  if (q === null) q = "";
  if (page === null) page = 1;
  if (itemsPerPage === null) itemsPerPage = ITEMSPERPAGE;
  if (sorting === null) sorting = "date";
  if (role === null) role = "all";

  const youtubeInfos = await getAllYoutubeInfosByArtistId(
    params.artistId,
    q,
    Number(page),
    Number(itemsPerPage),
    sorting,
    role
  );

  const totalVidoes = await getAllYoutubeInfosCountByArtistId(
    params.artistId,
    q,
    role
  );
  // console.log(youtubeInfos, totalVidoes);

  return json({ youtubeInfos, totalVidoes });
}

export default function MVArtistDetailsPage() {
  const { youtubeInfos, totalVidoes } = useLoaderData<typeof loader>();
  // console.log(youtubeInfos);
  const [myParams] = useSearchParams();
  const gotParams: gotParamsType = getMyParams(myParams);
  const { q, page, itemsPerPage, sorting } = gotParams;

  const [showModal, setShowModal] = useRecoilState(modalState);
  const [video, setVideo] = useRecoilState(videoState);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full px-2 pb-4">
        <SearchForm
          method="get"
          action=""
          gotParams={gotParams}
          showSorting={true}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {youtubeInfos.length === 0 && (
          <div className="text-md px-4 font-bold dark:bg-dodger-700">
            No Result
          </div>
        )}
        {youtubeInfos &&
          youtubeInfos.map((mv: any) => (
            <button
              type="button"
              onClick={() => {
                setShowModal(true);
                setVideo(mv);
              }}
              key={mv.youtubeId}
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
    </div>
  );
}
