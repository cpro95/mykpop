import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

import type {
  LoaderFunction,
  ActionFunction,
  MetaFunction,
} from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { assertIsPostOrDelete } from "~/utils/http.server";
import type { Video } from "@prisma/client";
import { requireUserId } from "~/utils/session.server";

import { deleteVideo } from "~/models/video.server";
import { getVideo } from "~/models/video.server";

type YoutubeInfo = {
  publishedAt: string;
  title: string;
  thumbnail: string;
  viewCount: string;
  likeCount: string;
  favoriteCount: string;
  commentCount: string;
};

type MyLoaderData = {
  video: Video;
  youtubeInfo: YoutubeInfo;
};

export const meta: MetaFunction = (props) => {
  // default return
  return {
    title: "Admin video",
    description: "Admin video",
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request);
  invariant(params.videoId, "videoId not found");

  const video = await getVideo(params.videoId);
  // console.debug(video);

  if (!video) {
    throw new Response("Not Found", { status: 404 });
  }

  const result = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?id=${video.youtube_id}&key=${process.env.YOUTUBE_API_KEY}&part=sni%20%20%20%20ppet,statistics&fields=items(id,snippet,statistics)`
  );
  // https://www.googleapis.com/youtube/v3/videos?id=RDJh4QFaPmdss&key=AIzaSyCsVQhZdb26hNg2d7PnxuXr__EowIh6z7o&part=snippet,statistics&fields=items(id,snippet,statistics)
  // Jh4QFaPmdss
  // AIzaSyCsVQhZdb26hNg2d7PnxuXr__EowIh6z7o

  const youtube = await result.json();
  // console.log("youtube is");
  // console.log(youtube.items[0].snippet);
  // console.log(youtube.items[0].statistics);

  let youtubeInfo: YoutubeInfo;
  if (youtube.items.length === 0) {
    console.log("no video");
    youtubeInfo = {
      publishedAt: "",
      title: "",
      thumbnail: "",
      viewCount: "",
      likeCount: "",
      favoriteCount: "",
      commentCount: "",
    };
  } else {
    youtubeInfo = {
      publishedAt: youtube.items[0].snippet.publishedAt,
      title: youtube.items[0].snippet.title,
      thumbnail: youtube.items[0].snippet.thumbnails.high.url,
      viewCount: youtube.items[0].statistics.viewCount,
      likeCount: youtube.items[0].statistics.likeCount,
      favoriteCount: youtube.items[0].statistics.favoriteCount,
      commentCount: youtube.items[0].statistics.commentCount,
    };
  }

  // console.log(youtubeInfo);
  return json<MyLoaderData>({ video, youtubeInfo });
};

export const action: ActionFunction = async ({ request, params }) => {
  assertIsPostOrDelete(request);

  await requireUserId(request);
  invariant(params.videoId, "videoId not found");

  const formData = request.formData();
  const actionType = (await formData).get("_action");

  if (actionType === "delete-video") {
    await deleteVideo({ id: params.videoId });
  }

  if (actionType === "update-video") {
    return redirect(`/admin/video/update/${params.videoId}`);
  }

  return redirect("/admin/video");
};

export default function VideoDetailPage() {
  const { video, youtubeInfo, error } = useLoaderData<typeof loader>();
  console.log(youtubeInfo);

  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  if (error) {
    return (
      <div className="flex w-full flex-row items-center justify-around">
        <h2 className="text-xl font-semibold my-4">Error : {error}</h2>
      </div>
    );
  }
  return (
    <div className="min-w-sm mx-auto flex w-full max-w-lg flex-col items-center space-y-6 overflow-hidden p-6 text-gray-800">
      <div className="w-full p-2">
        <Link
          to={`/admin/video/new?artistId=${video?.artistId}`}
          className="text-blue-700 hover:text-blue-300"
        >
          + New Video
        </Link>
      </div>
      <div className="flex w-full flex-row items-center justify-around">
        <h2 className="text-xl font-semibold">
          {video.title} / {video.youtube_id}
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
                        className="text-lg font-medium leading-6 text-gray-900 mb-4"
                      >
                        Are you sure for Delete?
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm mb-2 text-gray-500">
                          Press ESC key to cancel!
                        </p>
                      </div>
                      <Form method="delete">
                        <button
                          type="submit"
                          name="_action"
                          value="delete-video"
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
              value="update-video"
              className="rounded bg-green-900 bg-opacity-50 py-2 px-4 text-sm font-medium text-white hover:bg-green-600 focus:bg-green-400 dark:bg-green-300 dark:text-gray-700 dark:hover:bg-green-400"
            >
              Update
            </button>
          </Form>
        </div>
      </div>
      {youtubeInfo.title !== "" && (
        <div>
          <span>{youtubeInfo.title}</span>

          <img src={youtubeInfo.thumbnail} alt="youtube" />
          <div>
            count: {Number(youtubeInfo.viewCount).toLocaleString("ko-KR")}{' / '}
            likeCount: {Number(youtubeInfo.likeCount).toLocaleString("ko-KR")}
          </div>
        </div>
      )}
    </div>
  );
}
