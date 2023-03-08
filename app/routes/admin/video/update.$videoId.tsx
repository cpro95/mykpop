import React, { Fragment, useState } from "react";
import invariant from "tiny-invariant";
import { requireUserId } from "~/utils/session.server";
import { getVideo, updateVideo } from "~/models/video.server";
import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { useFormInputProps } from "remix-params-helper";
import { z } from "zod";
import { getArtistsIdAndName } from "~/models/artist.server";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const NewVideoFormSchema = z.object({
  videoId: z.string().min(2, "reuqire-videoId"),
  title: z.string().min(2, "require-name"),
  role: z.string().min(2, "require-role link"),
  youtubeId: z.string().min(2, "require-youtubeId"),
  artist: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
});

type ActionData = {
  title?: string;
  role?: string;
  youtubeId?: string;
  errors?: {
    title?: string;
    role?: string;
    youtubeId?: string;
    artist?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  await requireUserId(request);

  const formData = request.formData();

  const videoId = (await formData).get("videoId") as string;
  const title = (await formData).get("title") as string;
  const role = (await formData).get("role") as string;
  const youtubeId = (await formData).get("youtubeId") as string;
  const artistId = (await formData).get("artist[id]") as string;

  // const formValidation = await getFormData(request, NewVideoFormSchema);
  // if (!formValidation.success) {
  //   // console.log(formValidation.errors);

  //   return json<ActionData>(
  //     {
  //       errors: formValidation.errors,
  //     },
  //     {
  //       status: 400,
  //     }
  //   );
  // }
  // const { videoId, title, role, youtubeId, artist } = formValidation.data;

  await updateVideo(videoId, title, role, youtubeId, artistId);

  return redirect(`/admin/video`);
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request);
  invariant(params.videoId, "videoId not found");

  const video = await getVideo(params.videoId);
  if (!video) {
    throw new Response("Not Found", { status: 404 });
  }

  const allArtist = await getArtistsIdAndName();
  // console.log(allArtist);
  if (!allArtist) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ video, allArtist });
};

export default function UpdatevideoPage() {
  const { video, allArtist } = useLoaderData<typeof loader>();
  // console.log(allArtist);

  let matchedArtist = allArtist.find((obj: any) => obj.id === video.artistId);
  const [selectedArtist, setSelectedArtist] = useState(matchedArtist);

  const actionData = useActionData() as ActionData;

  const titleRef = React.useRef<HTMLInputElement>(null);
  const roleRef = React.useRef<HTMLInputElement>(null);
  const youtubeIdRef = React.useRef<HTMLInputElement>(null);

  const inputProps = useFormInputProps(NewVideoFormSchema);
  const transition = useTransition();

  const disabled =
    transition.state === "submitting" || transition.state === "loading";

  React.useEffect(() => {
    if (video.title && titleRef.current !== null) {
      titleRef.current.value = video?.title;
      titleRef.current?.focus();
    }
    if (video.role && roleRef.current !== null) {
      roleRef.current.value = video?.role;
      roleRef.current?.focus();
    }
    if (video.youtubeId && youtubeIdRef.current !== null) {
      youtubeIdRef.current.value = video?.youtubeId;
      youtubeIdRef.current?.focus();
    }
  }, [video]);

  return (
    <div className="relative w-full overflow-x-auto p-4 shadow-md sm:rounded-lg lg:w-10/12">
      <Form method="post">
        <input type="hidden" name="videoId" value={video.id} />
        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            artist :
          </label>
          <Listbox
            value={selectedArtist}
            onChange={setSelectedArtist}
            name="artist"
          >
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-gray-50 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate">{selectedArtist.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-50 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {allArtist.map((aa: any) => (
                    <Listbox.Option
                      {...inputProps("artist")}
                      key={aa.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? "bg-amber-100 text-amber-900"
                            : "text-gray-900"
                        }`
                      }
                      value={aa}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {aa.name}
                          </span>

                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>

          {actionData?.errors?.artist && (
            <div className="pt-1 text-red-700" id="artist-error">
              {actionData.errors.artist}
            </div>
          )}
        </div>
        <div>
          <label
            htmlFor="message"
            className="pt-2 mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            title :
          </label>
          <input
            {...inputProps("title")}
            ref={titleRef}
            name="title"
            id="title"
            placeholder="Title"
            className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-1.5 text-sm leading-loose text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage={
              actionData?.errors?.title ? "title-error" : undefined
            }
            disabled={disabled}
          />
          {actionData?.errors?.title && (
            <div className="pt-1 text-red-700" id="title-error">
              {actionData.errors.title}
            </div>
          )}
        </div>

        <div className="mt-4">
          <label
            htmlFor="role"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Role :
          </label>
          <div className="flex items-center mb-4">
            <input
              {...inputProps("role")}
              name="role"
              id="role1"
              type="radio"
              value="mv"
              className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
              aria-invalid={actionData?.errors?.role ? true : undefined}
              aria-errormessage={
                actionData?.errors?.role ? "role-error" : undefined
              }
              disabled={disabled}
              checked={video.role === "mv"}
            />
            <label
              htmlFor="role1"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              mv
            </label>
          </div>
          <div className="flex items-center mb-4">
            <input
              {...inputProps("role")}
              name="role"
              id="role2"
              type="radio"
              value="perf"
              className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
              aria-invalid={actionData?.errors?.role ? true : undefined}
              aria-errormessage={
                actionData?.errors?.role ? "role-error" : undefined
              }
              disabled={disabled}
              checked={video.role === "perf"}
            />
            <label
              htmlFor="role2"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              perf
            </label>
          </div>
          {actionData?.errors?.role && (
            <div className="pt-1 text-red-700" id="role-error">
              {actionData.errors.role}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            youtubeId :
          </label>
          <input
            {...inputProps("youtubeId")}
            name="youtubeId"
            ref={youtubeIdRef}
            id="youtubeId"
            placeholder="youtubeId"
            className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-1.5 text-sm leading-loose text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            aria-invalid={actionData?.errors?.youtubeId ? true : undefined}
            aria-errormessage={
              actionData?.errors?.youtubeId ? "youtubeId-error" : undefined
            }
            disabled={disabled}
          />
          {actionData?.errors?.youtubeId && (
            <div className="pt-1 text-red-700" id="youtubeId-error">
              {actionData.errors.youtubeId}
            </div>
          )}
        </div>

        <div className="mt-4 text-left">
          <button
            type="submit"
            className="bg-opcatiy-50 rounded bg-blue-500 py-2 px-4 text-sm font-medium text-white hover:bg-blue-600 focus:bg-blue-400 dark:bg-slate-300 dark:text-gray-700"
            disabled={disabled}
          >
            Update
          </button>
        </div>
      </Form>
    </div>
  );
}
