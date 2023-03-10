import { json } from "@remix-run/node";
import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import {
  useLoaderData,
  Outlet,
  Link,
  NavLink,
  useSearchParams,
} from "@remix-run/react";

import { notFound } from "~/utils/http.server";
import { getAllNotes, getNoteCount } from "~/models/note.server";
import { getUserId } from "~/utils/session.server";
import MyPagination from "~/components/my-pagination";
import { Layout } from "~/components/layout";
import { getMyParams } from "~/utils/utils";
import { ITEMSPERPAGE } from "~/utils/consts";
import { useTranslation } from "react-i18next";
import SearchForm from "~/components/search-form";

type MyLoaderData = {
  email?: string | undefined;
  notes?: Awaited<ReturnType<typeof getAllNotes>>;
  nbOfNotes?: number | undefined;
};

export const meta: MetaFunction = (props) => {
  if (props.location.pathname === "/notes/new") {
    return {
      title: `통계, Stats, myKPop, KPOP, 케이팝, 마이케이팝`,
      description: `KPOP, 케이팝, 블랙핑크, BLACKPINK, 뉴진스, NewJeans, 르세라핌, LE SSERAFIM`,
    };
  }

  if (props.location.pathname === "/notes") {
    return {
      title: `통계, Stats, myKPop, KPOP, 케이팝, 마이케이팝`,
      description: `KPOP, 케이팝, 블랙핑크, BLACKPINK, 뉴진스, NewJeans, 르세라핌, LE SSERAFIM`,
    };
  }

  if (props.params.noteId !== "") {
    const returnedTitleObjWrappedWithArray = props.data.notes?.filter(
      (note: any) => note.id === props.params.noteId
    );
    if (returnedTitleObjWrappedWithArray.length !== 0)
      return {
        title: returnedTitleObjWrappedWithArray[0].title + " in myKpop",
        description:
          returnedTitleObjWrappedWithArray[0].title +
          " by " +
          returnedTitleObjWrappedWithArray[0].user.email,
      };
  }

  // default return
  return {
    title: `통계, Stats, myKPop, KPOP, 케이팝, 마이케이팝`,
    description: `KPOP, 케이팝, 블랙핑크, BLACKPINK, 뉴진스, NewJeans, 르세라핌, LE SSERAFIM`,
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
  if (q === null) q = "";
  if (page === null) page = 1;
  if (itemsPerPage === null) itemsPerPage = ITEMSPERPAGE;

  const notes = await getAllNotes(q, Number(page), Number(itemsPerPage));
  const nbOfNotes = await getNoteCount();

  if (!notes) {
    throw notFound(`No Notes & your id ${userId}`);
  }

  return json<MyLoaderData>({ notes, nbOfNotes });
};

export default function NotesPage() {
  const data = useLoaderData() as MyLoaderData;
  const { t, i18n } = useTranslation();
  let formatLocale = "";
  i18n.language === "ko" ? (formatLocale = "ko-KR") : (formatLocale = "en-US");

  // console.log("note data is ====> ", data);

  const [myParams] = useSearchParams();
  const gotParams = getMyParams(myParams);
  const { q, page, itemsPerPage } = gotParams;

  return (
    <Layout title={t("Notes")} linkTo="/notes">
      <div className="flex w-full flex-col items-center justify-center px-2 pb-2 lg:w-10/12">
        <div className="w-full pt-4">
          <Link to="new" className="btn-primary mr-2">
            {t("New Note")}
          </Link>
          <Link to="/notes" className="btn-primary mr-2">
            {t("List Notes")}
          </Link>
        </div>

        {/* Start Search Component */}
        <div className="w-full px-2 pb-4">
          <SearchForm
            method="get"
            action=""
            gotParams={gotParams}
            showSorting={false}
          />
        </div>

        <div className="w-full pt-4">
          <Outlet />
        </div>

        {data.notes?.length === 0 ? (
          <p className="p-4 dark:text-dodger-300">{t("No-notes-yet")}</p>
        ) : (
          <div className="w-full py-4">
            <ul className="bg-white text-sm font-medium text-dodger-900 dark:bg-dodger-700 dark:text-dodger-200">
              {data.notes?.map((note: any) => (
                <li
                  key={note.id}
                  className="flex cursor-pointer flex-row items-center justify-between border-t bg-dodger-50 py-2 text-dodger-900 hover:bg-dodger-300 hover:text-dodger-600 dark:border-dodger-600 dark:bg-dodger-900 dark:text-dodger-300 dark:hover:bg-dodger-600 dark:hover:text-dodger-300"
                >
                  <NavLink
                    className={({ isActive }) =>
                      `w-full ${
                        isActive
                          ? "bg-dodger-200 px-4 py-2 font-bold underline dark:bg-dodger-600 dark:text-dodger-300"
                          : ""
                      }`
                    }
                    to={`${note.id}?page=${page}&itemsPerPage=${itemsPerPage}`}
                  >
                    <div className="flex flex-col">
                      <div className="text-lg">{note.title}</div>
                      <div className="flex flex-row justify-between">
                        <div className="text-xs">
                          {new Date(note.createdAt).toLocaleDateString(
                            formatLocale
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
        />
        {/* Pagination */}
      </div>
    </Layout>
  );
}
