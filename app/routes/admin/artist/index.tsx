import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireUserId } from "~/utils/session.server";
import { getAllArtist } from "~/models/artist.server";
import type { Artist } from "@prisma/client";

import { AgGridReact } from "ag-grid-react";
import agGrid from "ag-grid-community/styles/ag-grid.css";
import agThemeAlpine from "ag-grid-community/styles/ag-theme-alpine.css";
import { useMemo, useState, useCallback } from "react";
import { getVideoCountByArtistId } from "~/models/video.server";

type MyLoaderData = {
  allArtist: Artist[];
};

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: agGrid },
    { rel: "stylesheet", href: agThemeAlpine },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);

  const allArtist = await getAllArtist("", 1, 100000);
  if (!allArtist) {
    throw new Response("Not Found", { status: 404 });
  }

  return json<MyLoaderData>({ allArtist });
};

const createImageSpan = (image: string) => {
  const resultElement = document.createElement("div");

  const imageElement = document.createElement("img");
  imageElement.src = image;
  // imageElement.setAttribute("height", "30");
  imageElement.setAttribute("width", "30");
  resultElement.appendChild(imageElement);

  return resultElement;
};

const createImageSpan2 = (image: string) => {
  const resultElement = document.createElement("div");

  const imageElement = document.createElement("img");
  imageElement.src = image;
  // imageElement.setAttribute("height", "300");
  imageElement.setAttribute("width", "100");
  resultElement.appendChild(imageElement);

  return resultElement;
};

// This is a plain JS (not React) component
class myCellRenderer {
  private eGui!: HTMLElement;
  init(params: any) {
    // console.log(params);
    this.eGui = createImageSpan(params.value);
  }
  getGui() {
    return this.eGui;
  }
}

class myCellRenderer2 {
  private eGui!: HTMLElement;
  init(params: any) {
    // console.log(params);
    this.eGui = createImageSpan2(params.value);
  }
  getGui() {
    return this.eGui;
  }
}

export default function ArtistIndex() {
  const { allArtist } = useLoaderData<typeof loader>();
  // console.log(allArtist);

  const navigate = useNavigate();

  const [columnDefs] = useState([
    { field: "name", headerName: "Artist" },
    { field: "name_kor", headerName: "그룹명" },
    { field: "_count.videos", headerName: "Videos" },
    {
      field: "artist_logo",
      cellRenderer: myCellRenderer,
    },
    { field: "artist_poster", cellRenderer: myCellRenderer2 },
    { field: "company" },
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

  return (
    <div className="w-full p-2">
      <div className="w-full p-2">
        <Link to="new" className="text-blue-700 hover:text-blue-300">
          + New Artist
        </Link>
      </div>
      <div className="p-2 dark:text-gray-200">
        Total {allArtist.length} Artist(s)
      </div>
      <div className="ag-theme-alpine" style={{ width: "100%", height: 500 }}>
        <AgGridReact
          rowData={allArtist}
          columnDefs={columnDefs}
          rowSelection="single"
          detailRowAutoHeight={true}
          defaultColDef={defaultColDef}
          onRowClicked={({ data }) => {
            navigate(data.id);
          }}
          onFirstDataRendered={firstDataRendered}
        ></AgGridReact>
        {/* {allArtist?.map((aa) => (
          <div key={aa.id}>
            <div className="mx-auto flex w-full max-w-lg flex-col items-center space-y-6 overflow-hidden rounded-lg bg-gray-50 p-6 text-gray-800 shadow-md">
              <Link to={aa.id}>
                <div className="space-x-4">
                  <img
                    alt="artist logo"
                    src={aa.artist_logo}
                    className="h-12 w-12 rounded-full bg-gray-500 object-cover shadow"
                  />
                </div>
                <div className="mx-auto w-full">
                  <img
                    src={aa.artist_poster}
                    alt="artist poster"
                    className="mb-4 w-full bg-gray-500 object-cover sm:h-96"
                  />
                  <h2 className="mb-1 text-xl font-semibold">
                    {aa.name} / {aa.name_kor}
                  </h2>
                  <p className="text-sm text-gray-600">{aa.company}</p>
                </div>
                <div className="flex flex-wrap justify-between">
                  <div className="space-x-2">
                    <button
                      aria-label="Share this post"
                      type="button"
                      className="p-2 text-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 fill-current text-blue-600"
                      >
                      </svg>
                    <button
                      type="button"
                      className="p-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 fill-current text-blue-600"
                      >
                        <path d="M424,496H388.75L256.008,381.19,123.467,496H88V16H424ZM120,48V456.667l135.992-117.8L392,456.5V48Z"></path>
                    </button>
                  </div>
                  <div className="flex space-x-2 text-sm text-gray-600">
                    <button
                      type="button"
                      className="flex items-center space-x-1.5 p-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-label="Number of comments"
                        className="h-4 w-4 fill-current text-blue-600"
                      >
                      <span>30</span>
                    </button>
                      type="button"
                      className="flex items-center space-x-1.5 p-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-label="Number of likes"
                        className="h-4 w-4 fill-current text-blue-600"
                      >
                      <span>283</span>
                    </button>
                </div>
              </Link>
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
}
