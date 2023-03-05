import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { Layout } from "~/components/layout";
import MyPagination from "~/components/my-pagination";
import SearchForm from "~/components/search-form";
import { getAllArtist, getAllArtistCount } from "~/models/artist.server";
import { ITEMSPERPAGE } from "~/utils/consts";
import type { gotParamsType } from "~/utils/types";
import { getMyParams } from "~/utils/utils";
import { useTranslation } from "react-i18next";

export const meta: MetaFunction = () => {
  return {
    title: "All About K-Pop",
    description: "K-Pop의 모든 것, All About K-Pop",
  };
};

export async function loader({ request }: LoaderArgs) {
  // Parsing URL query
  const url = new URL(request.url);

  let q = url.searchParams.get("q") as string | null;
  let page = url.searchParams.get("page") as string | number | null;
  let itemsPerPage = url.searchParams.get("itemsPerPage") as
    | string
    | number
    | null;
  if (q === null) q = "";
  if (page === null) page = 1;
  if (itemsPerPage === null) itemsPerPage = ITEMSPERPAGE;

  const allArtist = await getAllArtist(q, Number(page), Number(itemsPerPage));
  const totalArtists = await getAllArtistCount(q);
  // console.log(allArtist, totalArtists);

  return json({ allArtist, totalArtists });
}

function Home() {
  const { allArtist, totalArtists } = useLoaderData<typeof loader>();
  const [myParams] = useSearchParams();
  const { q, page, itemsPerPage } = getMyParams(myParams);
  const gotParams: gotParamsType = { q, page, itemsPerPage };

  let { t } = useTranslation();

  return (
    <Layout title={t("Home")} linkTo="/">
      <div className="flex w-full flex-col items-center dark:text-white sm:overflow-hidden lg:w-10/12">
        <section className="w-full">
          <div className="rounded-lg border border-dodger-200 bg-white p-4 text-center shadow dark:border-dodger-700 dark:bg-dodger-800 sm:p-8">
            <h5 className="mb-6 text-3xl font-bold text-dodger-900 dark:text-white">
              K-Pop is Everywhere!
            </h5>
            <p className="text-base text-dodger-600 dark:text-dodger-400 sm:text-lg">
              {t("greeting")}
            </p>
          </div>
        </section>

        <div className="w-full">
          <SearchForm
            method="get"
            action=""
            gotParams={gotParams}
            showSorting={false}
          />
        </div>
        <div className="flex w-full items-center justify-center">
          <section className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
            {Array.isArray(allArtist) && allArtist.length !== 0 ? (
              allArtist.map((aa: any) => (
                <Link
                  key={aa.id}
                  to={`mv/${aa.id}`}
                  className="max-w-sm cursor-pointer rounded-lg border border-dodger-200 bg-white shadow hover:scale-105
                  hover:shadow-2xl dark:border-dodger-700 dark:bg-dodger-800
                  "
                >
                  <img
                    className="h-44 w-full object-cover"
                    src={aa.artistPoster}
                    alt={aa.nameKor}
                  />

                  <div className="p-5">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-dodger-900 dark:text-white">
                      {aa.name} / {aa.nameKor}
                    </h5>

                    <p className="mb-3 font-normal text-dodger-700 dark:text-dodger-400">
                      {`${aa._count.videos}${t("Videos")}`}
                    </p>
                    <p className="mb-3 font-bold text-dodger-800 dark:text-dodger-300">
                      {aa.company}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <span className="text-sm text-dodger-500 dark:text-dodger-400">
                {t("No Results")}
              </span>
            )}
          </section>
        </div>
        <MyPagination
          q={q}
          page={page}
          itemsPerPage={itemsPerPage}
          total_pages={Math.ceil(Number(totalArtists) / itemsPerPage)}
        />
      </div>
    </Layout>
  );
}

export default Home;
