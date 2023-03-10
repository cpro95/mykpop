import {
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import type { LoaderArgs, MetaFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Layout } from "~/components/layout";
import { getAllArtist } from "~/models/artist.server";
import type { Artist } from "@prisma/client";
import { useTranslation } from "react-i18next";
import { getMyParams } from "~/utils/utils";
import type { gotParamsType } from "~/utils/types";

export const meta: MetaFunction = () => {
  return {
    title: `myKPop, KPOP, 케이팝, 마이케이팝`,
    description: `KPOP, 케이팝, 블랙핑크, BLACKPINK, 뉴진스, NewJeans, 르세라핌, LE SSERAFIM`,
  };
};

export async function loader({ request }: LoaderArgs) {
  const allArtist = await getAllArtist("", 1, 1000);

  return json(allArtist);
}

function Mv() {
  const allArtist = useLoaderData<Array<Artist>>();
  const { t } = useTranslation();

  const [myParams] = useSearchParams();
  const gotParams: gotParamsType = getMyParams(myParams);
  const { q, page, itemsPerPage, sorting, role } = gotParams;

  return (
    <Layout title={t("MV")!} linkTo="/mv">
      <div className="w-full dark:text-white sm:overflow-hidden lg:w-10/12">
        <div className="flex flex-col md:grid md:grid-cols-12">
          <div className="md:col-span-3">
            <ul className="flex flex-row flex-wrap space-x-4 pt-4 pl-2 sm:mt-4 md:flex-col md:items-baseline md:space-y-4">
              <li>
                <Link
                  className="my-2 text-base tracking-wider dark:text-dodger-200 sm:text-base md:text-xl"
                  to={`/mv?q=${q}&page=${page}&itemsPerPage=${itemsPerPage}${
                    sorting ? "&sorting=" + sorting : ""
                  }${role ? "&role=" + role : ""}`}
                >
                  ALL
                </Link>
              </li>
              {allArtist &&
                allArtist.map((aa) => (
                  <li key={aa.id}>
                    <NavLink
                      className={({ isActive }) =>
                        `my-2 text-base tracking-wider dark:text-dodger-200 sm:text-base md:text-xl ${
                          isActive ? "border-b-4 border-b-dodger-500" : ""
                        }`
                      }
                      to={`/mv/${
                        aa.id
                      }?q=${q}&page=${page}&itemsPerPage=${itemsPerPage}${
                        sorting ? "&sorting=" + sorting : ""
                      }${role ? "&role=" + role : ""}`}
                    >
                      {aa.name}
                    </NavLink>
                  </li>
                ))}
            </ul>
          </div>
          <div className="md:col-span-9">
            <Outlet />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Mv;
