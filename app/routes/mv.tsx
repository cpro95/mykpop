import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
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
      <div className="w-full rounded-lg shadow-xl dark:text-white sm:overflow-hidden lg:w-10/12">
        <div className="grid grid-cols-12">
          <div className="col-span-2 border border-blue-800">
            <ul className="flex flex-col p-4">
              {allArtist &&
                allArtist.map((aa) => (
                  <li key={aa.id}>
                    <NavLink
                      className={({ isActive }) =>
                        `sm:text-md my-2 block border-b text-xs dark:text-gray-200 md:text-xl ${
                          isActive ? "bg-white dark:bg-gray-700" : ""
                        }`
                      }
                      to={aa.id}
                    >
                      {aa.name}
                    </NavLink>
                  </li>
                ))}
            </ul>
          </div>
          <div className="col-span-10 border border-lime-800">
            <Outlet />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Mv;
