import React from "react";
import invariant from "tiny-invariant";
import { requireUserId } from "~/utils/session.server";
import type { Artist } from "~/models/artist.server";
import { getArtist, updateArtist } from "~/models/artist.server";
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

const NewArtistFormSchema = z.object({
  artistId: z.string().min(2, "reuqire-artistId"),
  name: z.string().min(2, "require-name"),
  nameKor: z.string().min(1, "require-nameKor"),
  artistLogo: z.string().min(2, "require-artistLogo link"),
  artistPoster: z.string().min(2, "require-artistPoster link"),
  company: z.string().min(2, "require-company"),
});

type LoaderData = {
  artist: Artist;
};

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
  await requireUserId(request);

  const formValidation = await getFormData(request, NewArtistFormSchema);
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
  const { artistId, name, nameKor, artistLogo, artistPoster, company } =
    formValidation.data;

  await updateArtist(
    artistId,
    name,
    nameKor,
    artistLogo,
    artistPoster,
    company
  );

  return redirect(`/admin/artist`);
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request);
  invariant(params.artistId, "artistId not found");

  const artist = await getArtist(params.artistId);
  if (!artist) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ artist });
};

export default function UpdateartistPage() {
  const { artist } = useLoaderData<typeof loader>();

  const actionData = useActionData() as ActionData;
  const nameRef = React.useRef<HTMLInputElement>(null);
  const nameKorRef = React.useRef<HTMLInputElement>(null);
  const artistLogoRef = React.useRef<HTMLInputElement>(null);
  const artistPosterRef = React.useRef<HTMLInputElement>(null);
  const companyRef = React.useRef<HTMLInputElement>(null);
  const inputProps = useFormInputProps(NewArtistFormSchema);
  const transition = useTransition();

  const disabled =
    transition.state === "submitting" || transition.state === "loading";

  React.useEffect(() => {
    if (artist.name && nameRef.current !== null) {
      nameRef.current.value = artist?.name;
      nameRef.current?.focus();
    }
    if (artist.nameKor && nameKorRef.current !== null) {
      nameKorRef.current.value = artist?.nameKor;
      nameKorRef.current?.focus();
    }
    if (artist.artistLogo && artistLogoRef.current !== null) {
      artistLogoRef.current.value = artist?.artistLogo;
      artistLogoRef.current?.focus();
    }
    if (artist.artistPoster && artistPosterRef.current !== null) {
      artistPosterRef.current.value = artist?.artistPoster;
      artistPosterRef.current?.focus();
    }
    if (artist.company && companyRef.current !== null) {
      companyRef.current.value = artist?.company;
      companyRef.current?.focus();
    }
  }, [artist]);

  return (
    <div className="relative w-full overflow-x-auto p-4 shadow-md sm:rounded-lg lg:w-10/12">
      <Form method="post">
        <input type="hidden" name="artistId" value={artist.id} />
        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            name :
          </label>
          <input
            {...inputProps("name")}
            ref={nameRef}
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
            ref={nameKorRef}
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
            ref={artistLogoRef}
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
            ref={artistPosterRef}
            name="artistPoster"
            id="artistPoster"
            placeholder="artistPoster url link"
            className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-1.5 text-sm leading-loose text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            aria-invalid={actionData?.errors?.artistPoster ? true : undefined}
            aria-errormessage={
              actionData?.errors?.artistPoster
                ? "artistPoster-error"
                : undefined
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
            ref={companyRef}
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
            className="rounded bg-blue-500 py-2 px-4 text-sm font-medium text-white hover:bg-blue-600 focus:bg-blue-400 dark:bg-slate-300 dark:text-gray-700"
            disabled={disabled}
          >
            Update
          </button>
        </div>
      </Form>
    </div>
  );
}
