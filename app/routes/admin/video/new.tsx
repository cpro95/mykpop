import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useSearchParams,
  useTransition,
} from "@remix-run/react";
import { useFormInputProps } from "remix-params-helper";
import { z } from "zod";

import { assertIsPost } from "~/utils/http.server";

import { requireUserId } from "~/utils/session.server";
import { createVideo } from "~/models/video.server";
import { getArtistsIdAndName } from "~/models/artist.server";

import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { createYoutubeInfo } from "~/models/youtubeInfo.server";

const NewVideoFormSchema = z.object({
  title: z.string().min(2, "require-name"),
  youtubeId: z.string().min(1, "require-name_kor"),
});

type ActionData = {
  title?: string;
  youtubeId?: string;
  errors?: {
    title?: string;
    youtubeId?: string;
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);

  const allArtist = await getArtistsIdAndName();
  // console.log(allArtist);
  if (!allArtist) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ allArtist });
};



export const action: ActionFunction = async ({ request }) => {
  assertIsPost(request);
  await requireUserId(request);

  const formData = request.formData();
  const artistId = (await formData).get("artist[id]") as string;
  // const artistName = (await formData).get("artist[name]") as string;
  const title = (await formData).get("title") as string;
  const youtubeId = (await formData).get("youtubeId") as string;
  // console.log(artistId, artistName, title, youtubeId);

  // const formValidation = await getFormData(request, NewVideoFormSchema);

  // if (!formValidation.success) {
  //   return json<ActionData>(
  //     {
  //       errors: formValidation.errors,
  //     },
  //     {
  //       status: 400,
  //     }
  //   );
  // }

  // const { artistId, title, youtubeId } = formValidation.data;

  const video = await createVideo(artistId, title, youtubeId);
  await createYoutubeInfo(artistId, video.id, youtubeId);

  return redirect(`/admin/video/${video.id}`);
  // return json({});
};

export default function NewVideoPage() {
  const { allArtist } = useLoaderData();
  // console.log(allArtist);

  let matchedArtist;

  const [artistIdParams] = useSearchParams();
  // console.log("useSearchParams ===>", artistIdParams);
  if (artistIdParams.has("artistId")) {
    const artistId = artistIdParams.get("artistId") as string;
    // console.log("Inside NewVideoPage ===>", artistId);
    matchedArtist = allArtist.find((obj: any) => obj.id === artistId);
    // console.log(matchedArtist);
  } else {
    matchedArtist = allArtist[0];
  }

  const actionData = useActionData() as ActionData;
  const inputProps = useFormInputProps(NewVideoFormSchema);
  const transition = useTransition();
  const disabled =
    transition.state === "submitting" || transition.state === "loading";

  const [selected, setSelected] = useState(matchedArtist);

  return (
    <Form method="post" className="p-2">
      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Artist :
        </label>
        <Listbox value={selected} onChange={setSelected} name="artist">
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-gray-50 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
              <span className="block truncate">{selected.name}</span>
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
                    key={aa.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-amber-100 text-amber-900" : "text-gray-900"
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
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
      </div>
      <div className="mt-4">
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Title :
        </label>
        <input
          {...inputProps("title")}
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

      <div>
        <label
          htmlFor="youtubeId"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          youtubeId :
        </label>
        <input
          {...inputProps("youtubeId")}
          name="youtubeId"
          id="youtubeId"
          placeholder="Youtube ID"
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
          className="rounded bg-blue-800 bg-opacity-70 py-2 px-4 text-sm font-semibold text-white hover:bg-blue-600 hover:bg-opacity-70 focus:bg-blue-400 dark:bg-slate-300 dark:text-gray-700"
          disabled={disabled}
        >
          Save
        </button>
      </div>
    </Form>
  );
}
