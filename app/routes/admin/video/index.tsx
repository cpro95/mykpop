import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireUserId } from "~/utils/session.server";
import { getAllVideo } from "~/models/video.server";
import type { Video } from "@prisma/client";

import { AgGridReact } from "ag-grid-react";
import agGrid from "ag-grid-community/styles/ag-grid.css";
import agThemeAlpine from "ag-grid-community/styles/ag-theme-alpine.css";

import { useMemo, useState, useCallback } from "react";

type MyLoaderData = {
  allVideo: Video[];
};

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: agGrid },
    { rel: "stylesheet", href: agThemeAlpine },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);

  const allVideo = await getAllVideo("", 1, 1000000);
  // console.log(allVideo);
  if (!allVideo) {
    throw new Response("Not Found", { status: 404 });
  }

  return json<MyLoaderData>({ allVideo });
};

export default function VideoIndex() {
  const { allVideo } = useLoaderData<typeof loader>();
  // console.log(allVideo);

  const navigate = useNavigate();

  const [columnDefs] = useState([
    { field: "id", hide: true },
    { field: "title" },
    { field: "role" },
    { field: "artist.name", headerName: "Artist" },
    { field: "artist.nameKor", headerName: "그룹명", hide: true },
    { field: "artist.company", hide: true },
    { field: "updatedAt", hide: true },
    { field: "youtubeId" },
    {
      field: "youtubeTitle",
      valueGetter: (params: any) => {
        return params.data.youtubeInfo[0].youtubeTitle;
      },
    },
    {
      field: "youtubeViewCount",
      valueGetter: (params: any) => {
        return Number(
          params.data.youtubeInfo[0].youtubeViewCount
        ).toLocaleString("ko-KR");
      },
    },
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
          + New Video
        </Link>
      </div>
      <div className="p-2 dark:text-gray-200">
        Total {allVideo.length} video(s)
      </div>
      <div className="w-full">
        {/* {allVideo?.map((av: any) => (
          <div key={av.id}>
            <Link to={av.id}>
              {av.title} / {av.artist.name} / {av.artist.name_kor} / {av.artist.company}
            </Link>
          </div>
        ))} */}
        <div className="ag-theme-alpine" style={{ width: "100%", height: 500 }}>
          <AgGridReact
            rowData={allVideo}
            columnDefs={columnDefs}
            rowSelection="single"
            detailRowAutoHeight={true}
            defaultColDef={defaultColDef}
            onRowClicked={({ data }) => {
              navigate(data.id);
            }}
            onFirstDataRendered={firstDataRendered}
          ></AgGridReact>
        </div>
      </div>
    </div>
  );
}
