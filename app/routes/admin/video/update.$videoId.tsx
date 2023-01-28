import React from "react";
import invariant from "tiny-invariant";
import { requireUserId } from "~/utils/session.server";
import type { Video } from "~/models/video.server";
import { getVideo, updateVideo } from "~/models/video.server";
import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { getFormData, useFormInputProps } from "remix-params-helper";
import { z } from "zod";

const NewVideoFormSchema = z.object({
  videoId: z.string().min(2, "reuqire-videoId"),
  title: z.string().min(2, "require-name"),
  role: z.string().min(2, "require-role link"),
  youtube_id: z.string().min(2, "require-youtube_id"),
});

type LoaderData = {
  video: Video;
};

type ActionData = {
  title?: string;
  role?: string;
  youtube_id?: string;
  errors?: {
    title?: string;
    role?: string;
    youtube_id?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  await requireUserId(request);

  const formValidation = await getFormData(request, NewVideoFormSchema);
  if (!formValidation.success) {
    // console.log(formValidation.errors);

    return json<ActionData>(
      {
        errors: formValidation.errors,
      },
      {
        status: 400,
      }
    );
  }
  const { videoId, title, role, youtube_id } = formValidation.data;

  await updateVideo(videoId, title, role, youtube_id);

  return redirect(`/admin/video`);
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request);
  invariant(params.videoId, "videoId not found");

  const video = await getVideo(params.videoId);
  if (!video) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ video });
};

export default function UpdatevideoPage() {
  const { video } = useLoaderData<typeof loader>();
  // console.log(video);

  const actionData = useActionData() as ActionData;

  const titleRef = React.useRef<HTMLInputElement>(null);
  const roleRef = React.useRef<HTMLInputElement>(null);
  const youtube_idRef = React.useRef<HTMLInputElement>(null);

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
    if (video.youtube_id && youtube_idRef.current !== null) {
      youtube_idRef.current.value = video?.youtube_id;
      youtube_idRef.current?.focus();
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

        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            role :
          </label>
          <input
            {...inputProps("role")}
            name="role"
            ref={roleRef}
            id="role"
            placeholder="Role"
            className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-1.5 text-sm leading-loose text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            aria-invalid={actionData?.errors?.role ? true : undefined}
            aria-errormessage={
              actionData?.errors?.role ? "role-error" : undefined
            }
            disabled={disabled}
          />
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
            youtube_id :
          </label>
          <input
            {...inputProps("youtube_id")}
            name="youtube_id"
            ref={youtube_idRef}
            id="youtube_id"
            placeholder="youtube_id"
            className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-1.5 text-sm leading-loose text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            aria-invalid={actionData?.errors?.youtube_id ? true : undefined}
            aria-errormessage={
              actionData?.errors?.youtube_id ? "youtube_id-error" : undefined
            }
            disabled={disabled}
          />
          {actionData?.errors?.youtube_id && (
            <div className="pt-1 text-red-700" id="youtube_id-error">
              {actionData.errors.youtube_id}
            </div>
          )}
        </div>

        <div className="mt-4 text-left">
          <button
            type="submit"
            className="rounded bg-blue-500 bg-opcatiy-50 py-2 px-4 text-sm font-medium text-white hover:bg-blue-600 focus:bg-blue-400 dark:bg-slate-300 dark:text-gray-700"
            disabled={disabled}
          >
            Update
          </button>
        </div>
      </Form>
    </div>
  );
}
