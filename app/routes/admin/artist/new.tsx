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
  nameKor: z.string().min(1, "require-nameKor"),
  artistLogo: z.string().min(2, "require-artistLogo link"),
  artistPoster: z.string().min(2, "require-artistPoster link"),
  company: z.string().min(2, "require-company"),
});

type ActionData = {
  name?: string;
  nameKor?: string;
  artistLogo?: string;
  artistPoster?: string;
  company?: string;
  errors?: {
    name?: string;
    nameKor?: string;
    artistLogo?: string;
    artistPoster?: string;
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

  const { name, nameKor, artistLogo, artistPoster, company } =
    formValidation.data;

  const artist = await createArtist(
    name,
    nameKor,
    artistLogo,
    artistPoster,
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
          nameKor :
        </label>
        <input
          {...inputProps("nameKor")}
          name="nameKor"
          id="nameKor"
          placeholder="Name Korean"
          className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-1.5 text-sm leading-loose text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          aria-invalid={actionData?.errors?.nameKor ? true : undefined}
          aria-errormessage={
            actionData?.errors?.nameKor ? "nameKor-error" : undefined
          }
          disabled={disabled}
        />
        {actionData?.errors?.nameKor && (
          <div className="pt-1 text-red-700" id="nameKor-error">
            {actionData.errors.nameKor}
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          artistLogo :
        </label>
        <input
          {...inputProps("artistLogo")}
          name="artistLogo"
          id="artistLogo"
          placeholder="artistLogo url link"
          className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-1.5 text-sm leading-loose text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          aria-invalid={actionData?.errors?.artistLogo ? true : undefined}
          aria-errormessage={
            actionData?.errors?.artistLogo ? "artistLogo-error" : undefined
          }
          disabled={disabled}
        />
        {actionData?.errors?.artistLogo && (
          <div className="pt-1 text-red-700" id="artistLogo-error">
            {actionData.errors.artistLogo}
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          artistPoster :
        </label>
        <input
          {...inputProps("artistPoster")}
          name="artistPoster"
          id="artistPoster"
          placeholder="artistPoster url link"
          className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-1.5 text-sm leading-loose text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          aria-invalid={actionData?.errors?.artistPoster ? true : undefined}
          aria-errormessage={
            actionData?.errors?.artistPoster ? "artistPoster-error" : undefined
          }
          disabled={disabled}
        />
        {actionData?.errors?.artistPoster && (
          <div className="pt-1 text-red-700" id="artistPoster-error">
            {actionData.errors.artistPoster}
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
