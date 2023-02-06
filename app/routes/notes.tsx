import { json } from "@remix-run/node";
import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import {
  useLoaderData,
  Outlet,
  Link,
  NavLink,
  useSearchParams,
  useTransition,
  Form,
} from "@remix-run/react";

import { notFound } from "~/utils/http.server";
import { getAllNotes, getNoteCount } from "~/models/note.server";
import { getUserId } from "~/utils/session.server";
import { z } from "zod";
import { useFormInputProps } from "remix-params-helper";
import MyPagination from "~/components/my-pagination";
import { Layout } from "~/components/layout";
import { getMyParams } from "~/utils/utils";
import { DEFAULT_LANGUAGE, ITEMSPERPAGE } from "~/utils/consts";

type MyLoaderData = {
  email?: string | undefined;
  notes?: Awaited<ReturnType<typeof getAllNotes>>;
  nbOfNotes?: number | undefined;
};

export const searchNotesSchema = z.object({
  query: z.string().min(2, "Please provide search query!"),
});

export const notesSchema = z.object({
  index: z.void().optional(),
  query: z.string().optional(),
  page: z.string().optional(),
  itemsPerPage: z.string().optional(),
  viewType: z.string().optional(),
});

export const meta: MetaFunction = (props) => {
  // console.log("Inside meta ===>", props);
  if (props.location.pathname === "/notes/new") {
    return {
      title: "Writing!",
    };
  }

  if (props.location.pathname === "/notes") {
    return {
      title: "BBS!",
    };
  }

  if (props.params.noteId !== "") {
    const returnedTitleObjWrappedWithArray = props.data.notes?.filter(
      (note: any) => note.id === props.params.noteId
    );
    if (returnedTitleObjWrappedWithArray.length !== 0)
      return {
        title:
          returnedTitleObjWrappedWithArray[0].title + " in MyMovies Remix App",
        description:
          returnedTitleObjWrappedWithArray[0].title +
          " by " +
          returnedTitleObjWrappedWithArray[0].user.email,
      };
  }

  // default return
  return {
    title: "자유게시판",
    description: "자유게시판",
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = (await getUserId(request)) as string;

  // Parsing URL query
  const url = new URL(request.url);
  let q = url.searchParams.get("q") as string | null;
  let page = url.searchParams.get("page") as string | number | null;
  let itemsPerPage = url.searchParams.get("itemsPerPage") as
    | string
    | number
    | null;
  let sorting = url.searchParams.get("sorting") as string | null;

  if (q === null) q = "";
  if (page === null) page = 1;
  if (itemsPerPage === null) itemsPerPage = ITEMSPERPAGE;
  if (sorting === null) sorting = "date";

  const notes = await getAllNotes(q, Number(page), Number(itemsPerPage));
  const nbOfNotes = await getNoteCount();

  if (!notes) {
    throw notFound(`No Notes & your id ${userId}`);
  }

  return json<MyLoaderData>({ notes, nbOfNotes });
};

export default function NotesPage() {
  const data = useLoaderData() as MyLoaderData;
  // console.log("note data is ====> ", data);

  const [myParams] = useSearchParams();
  const { q, page, itemsPerPage, sorting } = getMyParams(myParams);

  const inputProps = useFormInputProps(searchNotesSchema);
  const transition = useTransition();
  let isSubmitting =
    transition.state === "submitting" || transition.state === "loading";

  return (
    <Layout title="notes" linkTo="/notes">
      <div className="flex w-full flex-col items-center justify-center px-2 pb-2 lg:w-10/12">
        <div className="w-full py-4">
          <Link to="new" className="btn-primary mr-2">
            New Note
          </Link>
          <Link to="/notes" className="btn-primary mr-2">
            List Notes
          </Link>
        </div>

        {/* Start Search Component */}
        <Form replace className="flex-cols flex w-full pt-2">
          <input type="hidden" name={q} value={q} />
          <input type="hidden" name={String(page)} value={String(page)} />
          <input
            type="hidden"
            name={String(itemsPerPage)}
            value={String(itemsPerPage)}
          />
          <input type="hidden" name={sorting} value={sorting} />

          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              {...inputProps("query")}
              className="search-label"
              placeholder="Search"
              type="text"
              name="query"
            />
          </div>
          <button
            className="search-button ml-2"
            type="submit"
            disabled={isSubmitting}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </button>
        </Form>
        {/* End of Search Component */}

        <div className="w-full pt-4">
          <Outlet />
        </div>

        {data.notes?.length === 0 ? (
          <p className="p-4">No notes yet</p>
        ) : (
          <div className="w-full py-4">
            <ul className="bg-white text-sm font-medium text-gray-900 dark:bg-gray-700 dark:text-gray-200">
              {data.notes?.map((note: any) => (
                <li
                  key={note.id}
                  className="flex cursor-pointer flex-row items-center justify-between border-t bg-dodger-50 py-2 text-gray-900 hover:bg-dodger-500 hover:text-gray-900 dark:border-dodger-600 dark:bg-dodger-900 dark:text-gray-300 dark:hover:bg-dodger-600 dark:hover:text-gray-900"
                >
                  <NavLink
                    className={({ isActive }) =>
                      `w-full ${
                        isActive
                          ? "bg-gray-200 px-4 py-2 font-bold underline dark:bg-gray-100 dark:text-gray-700"
                          : ""
                      }`
                    }
                    to={`${note.id}?page=${page}&itemsPerPage=${itemsPerPage}&sorting=${sorting}`}
                  >
                    <div className="flex flex-col">
                      <div className="text-lg">{note.title}</div>
                      <div className="flex flex-row justify-between">
                        <div className="text-xs">
                          {new Date(note.createdAt).toLocaleDateString(
                            DEFAULT_LANGUAGE
                          )}
                        </div>
                        <div className="ml-4 text-xs">{note.user.email}</div>
                      </div>
                    </div>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pagination */}
        <MyPagination
          q={q}
          page={page}
          itemsPerPage={itemsPerPage}
          total_pages={Math.ceil(Number(data.nbOfNotes) / itemsPerPage)}
          sorting={sorting}
        />
        {/* Pagination */}
      </div>
    </Layout>
  );
}
