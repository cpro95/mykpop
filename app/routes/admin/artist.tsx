import { Link, Outlet } from "@remix-run/react";
import { Layout } from "~/components/layout";

export default function ArtistLayout() {
  return (
    <Layout>
      <div className="relative w-full overflow-x-auto p-4 shadow-md sm:rounded-lg lg:w-10/12">
        <div className="flex flex-row items-center justify-around rounded-md bg-gray-200 p-2">
          <Link
            to="/admin/artist"
            className="text-blue-700 hover:text-blue-300"
          >
            Artist
          </Link>
          <Link to="/admin/video" className="text-blue-700 hover:text-blue-300">
            Video
          </Link>
        </div>
        <Outlet />
      </div>
    </Layout>
  );
}
