import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useActionData, useTransition } from "@remix-run/react";
import { getFormData, useFormInputProps } from "remix-params-helper";
import { z } from "zod";

import { assertIsPost } from "~/utils/http.server";

import { requireUserId } from "~/utils/session.server";
import { createArtist } from "~/models/artist.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);

  return {};
};

const NewArtistFormSchema = z.object({
  name: z.string().min(2, "require-name"),
  name_kor: z.string().min(1, "require-name_kor"),
  artist_logo: z.string().min(2, "require-artist_logo link"),
  artist_poster: z.string().min(2, "require-artist_poster link"),
  company: z.string().min(2, "require-company"),
});

type ActionData = {
  name?: string;
  name_kor?: string;
  artist_logo?: string;
  artist_poster?: string;
  company?: string;
  errors?: {
    name?: string;
    name_kor?: string;
    artist_logo?: string;
    artist_poster?: string;
    company?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  assertIsPost(request);

  await requireUserId(request);
  const formValidation = await getFormData(request, NewArtistFormSchema);

  if (!formValidation.success) {
    return json<ActionData>(
      {
        errors: formValidation.errors,
      },
      {
        status: 400,
      }
    );
  }

  const { name, name_kor, artist_logo, artist_poster, company } =
    formValidation.data;

  const artist = await createArtist(
    name,
    name_kor,
    artist_logo,
    artist_poster,
    company
  );

  return redirect(`/admin/artist/${artist.id}`);
};

export default function NewNotePage() {
  const actionData = useActionData() as ActionData;
  const inputProps = useFormInputProps(NewArtistFormSchema);
  const transition = useTransition();
  const disabled =
    transition.state === "submitting" || transition.state === "loading";

  return (
    <Form method="post" className="p-2">
      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          name :
        </label>
        <input
          {...inputProps("name")}
          name="name"
          id="name"
          placeholder="Name"
          className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-1.5 text-sm leading-loose text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          aria-invalid={actionData?.errors?.name ? true : undefined}
          aria-errormessage={
            actionData?.errors?.name ? "name-error" : undefined
          }
          disabled={disabled}
        />
        {actionData?.errors?.name && (
          <div className="pt-1 text-red-700" id="name-error">
            {actionData.errors.name}
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          name_kor :
        </label>
        <input
          {...inputProps("name_kor")}
          name="name_kor"
          id="name_kor"
          placeholder="Name Korean"
          className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-1.5 text-sm leading-loose text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          aria-invalid={actionData?.errors?.name_kor ? true : undefined}
          aria-errormessage={
            actionData?.errors?.name_kor ? "name_kor-error" : undefined
          }
          disabled={disabled}
        />
        {actionData?.errors?.name_kor && (
          <div className="pt-1 text-red-700" id="name_kor-error">
            {actionData.errors.name_kor}
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          artist_logo :
        </label>
        <input
          {...inputProps("artist_logo")}
          name="artist_logo"
          id="artist_logo"
          placeholder="artist_logo url link"
          className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-1.5 text-sm leading-loose text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          aria-invalid={actionData?.errors?.artist_logo ? true : undefined}
          aria-errormessage={
            actionData?.errors?.artist_logo ? "artist_logo-error" : undefined
          }
          disabled={disabled}
        />
        {actionData?.errors?.artist_logo && (
          <div className="pt-1 text-red-700" id="artist_logo-error">
            {actionData.errors.artist_logo}
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          artist_poster :
        </label>
        <input
          {...inputProps("artist_poster")}
          name="artist_poster"
          id="artist_poster"
          placeholder="artist_poster url link"
          className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-1.5 text-sm leading-loose text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          aria-invalid={actionData?.errors?.artist_poster ? true : undefined}
          aria-errormessage={
            actionData?.errors?.artist_poster
              ? "artist_poster-error"
              : undefined
          }
          disabled={disabled}
        />
        {actionData?.errors?.artist_poster && (
          <div className="pt-1 text-red-700" id="artist_poster-error">
            {actionData.errors.artist_poster}
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          company :
        </label>
        <input
          {...inputProps("company")}
          name="company"
          id="company"
          placeholder="company url link"
          className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-1.5 text-sm leading-loose text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          aria-invalid={actionData?.errors?.company ? true : undefined}
          aria-errormessage={
            actionData?.errors?.company ? "company-error" : undefined
          }
          disabled={disabled}
        />
        {actionData?.errors?.company && (
          <div className="pt-1 text-red-700" id="company-error">
            {actionData.errors.company}
          </div>
        )}
      </div>

      <div className="mt-4 text-left">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 dark:bg-slate-300 dark:text-gray-700"
          disabled={disabled}
        >
          Save
        </button>
      </div>
    </Form>
  );
}
