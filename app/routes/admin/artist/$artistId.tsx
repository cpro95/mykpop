import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useMemo, useCallback } from "react";
import type {
  LoaderFunction,
  ActionFunction,
  MetaFunction,
  LinksFunction,
} from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";
import { assertIsPostOrDelete } from "~/utils/http.server";
import type { Artist, Video } from "@prisma/client";
import { requireUserId } from "~/utils/session.server";

import { deleteArtist, getArtistWithUserId } from "~/models/artist.server";
import { getVideosOfArtistId } from "~/models/video.server";
import { AgGridReact } from "ag-grid-react";
import agGrid from "ag-grid-community/styles/ag-grid.css";
import agThemeAlpine from "ag-grid-community/styles/ag-theme-alpine.css";

type MyLoaderData = {
  artist: Artist;
  videos: Video[];
};

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: agGrid },
    { rel: "stylesheet", href: agThemeAlpine },
  ];
};

export const meta: MetaFunction = (props) => {
  // default return
  return {
    title: "Admin artist",
    description: "Admin artist",
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request);
  invariant(params.artistId, "artistId not found");

  const artist = await getArtistWithUserId(params.artistId);
  // console.log(artist);
  if (!artist) {
    throw new Response("Not Found", { status: 404 });
  }
  const videos = await getVideosOfArtistId(params.artistId);

  return json<MyLoaderData>({ artist, videos });
};

export const action: ActionFunction = async ({ request, params }) => {
  assertIsPostOrDelete(request);

  await requireUserId(request);
  invariant(params.artistId, "artistId not found");

  const formData = request.formData();
  const actionType = (await formData).get("_action");

  if (actionType === "delete-artist") {
    await deleteArtist({ id: params.artistId });
  }

  if (actionType === "update-artist") {
    return redirect(`/admin/artist/update/${params.artistId}`);
  }

  return redirect("/admin/artist");
};

export default function ArtistDetailPage() {
  const { artist, videos } = useLoaderData<typeof loader>();
  // console.log(videos);

  const navigate = useNavigate();

  const [columnDefs] = useState([
    { field: "id", hide: true },
    { field: "title" },
    { field: "role" },
    { field: "youtubeId" },
    { field: "createdAt" },
    { field: "updatedAt" },
    { field: "artistId", hide: true },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      resizable: true,
      sortable: true,
    };
  }, []);

  const firstDataRendered = useCallback((params: any) => {
    // console.log(params);
    params.columnApi.autoSizeAllColumns(true);
  }, []);

  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <div className="min-w-sm mx-auto flex w-full flex-col items-center space-y-6 overflow-hidden p-6 text-gray-800">
      <div className="w-full p-2">
        <Link
          to={`/admin/video/new?artistId=${artist.id}`}
          className="text-blue-700 hover:text-blue-300"
        >
          + New MusicVideo in {artist.name} / {artist.nameKor}
        </Link>
      </div>
      <div className="flex w-full items-center justify-around">
        <h2 className="text-xl font-semibold">
          {artist.name} / {artist.nameKor}
        </h2>
        <div className="flex space-x-1">
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={openModal}
              className="rounded-md bg-black bg-opacity-60 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            >
              Delete
            </button>
          </div>
          <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="mb-4 text-lg font-medium leading-6 text-gray-900"
                      >
                        Are you sure for Delete?
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="mb-2 text-sm text-gray-500">
                          Press ESC key to cancel!
                        </p>
                      </div>
                      <Form method="delete">
                        <button
                          type="submit"
                          name="_action"
                          value="delete-artist"
                          className="rounded bg-gray-500 bg-opacity-20 py-2 px-4 text-sm font-medium text-white hover:bg-blue-600 focus:bg-blue-400 dark:bg-blue-300 dark:text-gray-700 dark:hover:bg-blue-400"
                        >
                          Delete
                        </button>
                      </Form>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>

          <Form method="post">
            <button
              type="submit"
              name="_action"
              value="update-artist"
              className="rounded bg-green-900 bg-opacity-50 py-2 px-4 text-sm font-medium text-white hover:bg-green-600 focus:bg-green-400 dark:bg-green-300 dark:text-gray-700 dark:hover:bg-green-400"
            >
              Update
            </button>
          </Form>
        </div>
      </div>
      <div className="p-2 dark:text-gray-200">
        Total Video : {videos.length}
      </div>
      <div className="ag-theme-alpine" style={{ width: "100%", height: 500 }}>
        <AgGridReact
          rowData={videos}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="single"
          detailRowAutoHeight={true}
          onRowClicked={({ data }) => {
            navigate(`/admin/video/${data.id}`);
          }}
          onFirstDataRendered={firstDataRendered}
        ></AgGridReact>
      </div>
      {/* <div>
        {videos.map((v) => (
          <div key={v.id}>
            <Link to={`/admin/video/${v.id}`}>{v.title}</Link>
          </div>
        ))}
      </div> */}
    </div>
  );
}
