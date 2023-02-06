import {
  NavLink,
  Outlet,
  useLoaderData,
} from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Layout } from "~/components/layout";
import { getAllArtist } from "~/models/artist.server";
import type { Artist } from "@prisma/client";

export async function loader({ request }: LoaderArgs) {
  const allArtist = await getAllArtist("", 1, 1000);

  return json(allArtist);
}

function Mv() {
  const allArtist = useLoaderData<Array<Artist>>();

  return (
    <Layout title="MV" linkTo="/mv">
      <div className="w-full dark:text-white sm:overflow-hidden lg:w-10/12">
        <div className="flex flex-col md:grid md:grid-cols-12">
          <div className="md:col-span-3">
            <ul className="flex flex-row flex-wrap space-x-4 pt-4 pl-2 sm:mt-4 md:flex-col md:items-baseline md:space-y-4">
              {allArtist &&
                allArtist.map((aa) => (
                  <li key={aa.id}>
                    <NavLink
                      className={({ isActive }) =>
                        `my-2 text-base tracking-wider dark:text-dodger-200 sm:text-base md:text-xl ${
                          isActive ? "border-b-4 border-b-dodger-500" : ""
                        }`
                      }
                      to={`${aa.id}`}
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
