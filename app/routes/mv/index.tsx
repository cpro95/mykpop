import { useLoaderData, useSearchParams } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useRecoilState } from "recoil";
import { modalState, videoState } from "~/atoms/modalAtom";
import {
  getAllYoutubeInfosByNone,
  getAllYoutubeInfosCountByNone,
} from "~/models/youtube-info.server";
import VideoCard from "~/components/video-card";
import YoutubeModal from "~/components/youtube-modal";
import SearchForm from "~/components/search-form";
import { getMyParams } from "~/utils/utils";
import MyPagination from "~/components/my-pagination";
import { ITEMSPERPAGE } from "~/utils/consts";
import type { gotParamsType } from "~/utils/types";
import { useTranslation } from "react-i18next";

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
  let role = url.searchParams.get("role") as string | null;
  if (q === null) q = "";
  if (page === null) page = 1;
  if (itemsPerPage === null) itemsPerPage = ITEMSPERPAGE;
  if (sorting === null) sorting = "date";
  if (role === null) role = "all";

  const youtubeInfos = await getAllYoutubeInfosByNone(
    q,
    Number(page),
    Number(itemsPerPage),
    sorting,
    role
  );

  const totalVidoes = await getAllYoutubeInfosCountByNone(q, role);

  return json({ youtubeInfos, totalVidoes });
}

function MVHome() {
  const { youtubeInfos, totalVidoes } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  const [myParams] = useSearchParams();
  const gotParams: gotParamsType = getMyParams(myParams);
  const { q, page, itemsPerPage, sorting, role } = gotParams;

  const [showModal, setShowModal] = useRecoilState(modalState);
  const [video, setVideo] = useRecoilState(videoState);

  return (
    <section className="flex flex-col items-center">
      <div className="w-full px-2 pb-4">
        <SearchForm
          method="get"
          action=""
          gotParams={gotParams}
          showSorting={true}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.isArray(youtubeInfos) && youtubeInfos.length !== 0 ? (
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
          ))
        ) : (
          <span className="text-sm text-dodger-500 dark:text-dodger-400">
            {t("No Results")}
          </span>
        )}
        {showModal && <YoutubeModal />}
      </div>

      <MyPagination
        q={q}
        page={page}
        itemsPerPage={itemsPerPage}
        total_pages={Math.ceil(Number(totalVidoes) / itemsPerPage)}
        sorting={sorting}
        role={role}
      />
    </section>
  );
}

export default MVHome;
