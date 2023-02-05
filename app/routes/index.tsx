import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/layout";
import { getAllArtist } from "~/models/artist.server";

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
  const allArtist = await getAllArtist("", 1, 10000);

  if (!allArtist) {
    return json({});
  }

  return json(allArtist);
}

function Home() {
  const allArtist = useLoaderData<typeof loader>();

  return (
    <Layout title="Home" linkTo="/">
      <div className="w-full space-y-8 dark:text-white sm:overflow-hidden lg:w-10/12">
        <section className="">
          <div className="w-full rounded-lg border border-dodger-200 bg-white p-4 text-center shadow dark:border-dodger-700 dark:bg-dodger-800 sm:p-8">
            <h5 className="mb-2 text-3xl font-bold text-dodger-900 dark:text-white">
              K-Pop is Everywhere!
            </h5>
            <p className="mb-5 text-base text-dodger-600 dark:text-dodger-400 sm:text-lg">
              Stay up to date and find out how many k-pop music videos have
              youtube views!
            </p>
          </div>
        </section>
        <div className="flex items-center justify-center">
          <section className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {allArtist &&
              Array.isArray(allArtist) &&
              allArtist.map((aa: any) => (
                <Link
                  key={aa.id}
                  to={`mv/${aa.id}`}
                  className="max-w-sm rounded-lg border border-dodger-200 bg-white shadow dark:border-dodger-700 dark:bg-dodger-800"
                >
                  <img
                    className="h-48 w-full object-cover"
                    src={aa.artistPoster}
                    alt={aa.nameKor}
                  />
                  <div className="p-5">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-dodger-900 dark:text-white">
                      {aa.name} / {aa.nameKor}
                    </h5>
                    <p className="mb-3 font-normal text-dodger-700 dark:text-dodger-400">
                      {aa._count.videos} Music Videos
                    </p>
                    <p className="mb-3 font-bold text-dodger-800 dark:text-dodger-300">
                      {aa.company}
                    </p>
                  </div>
                </Link>
              ))}
          </section>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
