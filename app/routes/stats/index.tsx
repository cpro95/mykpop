import {
  Form,
  useLoaderData,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { ActionArgs, LoaderArgs, redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useTranslation } from "react-i18next";
import MyPagination from "~/components/my-pagination";
import {
  getStatPageData,
  getYoutubeInfoCount,
  getTopViewCount,
} from "~/models/youtube-info.server";
import { getArtistsIdAndName } from "~/models/artist.server";
import type { gotParamsType } from "~/utils/types";
import { getMyParams } from "~/utils/utils";
import { ITEMSPERPAGE } from "~/utils/consts";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { assertIsPost } from "~/utils/http.server";

export async function loader({ request }: LoaderArgs) {
  // Parsing URL query
  const url = new URL(request.url);
  let page = url.searchParams.get("page") as string | number | null;
  let itemsPerPage = url.searchParams.get("itemsPerPage") as
    | string
    | number
    | null;
  let id = url.searchParams.get("id") as string | null;

  let ids: any;
  if (id === null) {
    ids = [];
  } else {
    ids = id.split(",");
  }
  if (page === null) page = 1;
  if (itemsPerPage === null) itemsPerPage = ITEMSPERPAGE;

  const youtubeInfos = await getStatPageData(
    Number(page),
    Number(itemsPerPage),
    ids
  );
  // console.log(youtubeInfos);

  const totalVidoes = youtubeInfos.length;

  const topViewCount = youtubeInfos[0].youtubeViewCount;

  const allArtist = await getArtistsIdAndName();

  return json({ youtubeInfos, totalVidoes, topViewCount, allArtist });
}

export const action = async ({ request }: ActionArgs) => {
  assertIsPost(request);

  const formData = request.formData();
  const allEntries = [...(await formData).entries()];
  const itemsPerPage = (await formData).get("itemsPerPage") as string;

  const idsArray = allEntries
    .filter(([key, value]) => key.endsWith("[id]"))
    .map(([key, value]) => value);

  if (idsArray.length === 0) return json({});
  const returnUrl = idsArray.join(",");
  // console.log(returnUrl);

  return redirect(`./?id=${returnUrl}&itemsPerPage=${itemsPerPage}`);
};

function StatsHome() {
  const { youtubeInfos, totalVidoes, topViewCount, allArtist } =
    useLoaderData<typeof loader>();

  const [myParams] = useSearchParams();
  const gotParams: gotParamsType = getMyParams(myParams);
  const { page, itemsPerPage, id } = gotParams;

  const { t, i18n } = useTranslation();
  let formatLocale = "";
  i18n.language === "ko" ? (formatLocale = "ko-KR") : (formatLocale = "en-US");

  let firstView: number;
  if (!topViewCount) firstView = youtubeInfos[0].youtubeViewCount;
  else firstView = topViewCount;

  // console.log(allArtist);

  const [selected, setSelected] = useState([]);

  const submit = useSubmit();
  function handleChange(e: any) {
    let x = {
      page: String(gotParams.page),
      itemsPerPage: String(gotParams.itemsPerPage),
    };
    x.itemsPerPage = e.target.value;
    if (gotParams.id) {
      Object.assign(x, { id: gotParams.id });
    }
    // console.log("inside search-form x is ========>", x);
    submit(x, { replace: true });
  }

  return (
    <div className="flex w-full flex-col items-center dark:text-white sm:overflow-hidden lg:w-10/12">
      <section className="w-full flex flex-col items-center justify-center">
        <Form
          method="post"
          replace
          reloadDocument
          autoComplete="off"
          className="w-full p-2 items-center justify-center grid grid-cols-5 sm:grid-cols-8 gap-4"
        >
          <div className="w-full col-span-3 sm:col-span-6">
            <Listbox
              value={selected}
              onChange={setSelected}
              name="artist"
              multiple
            >
              <div className="relative z-20">
                <Listbox.Button className="relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 bg-dodger-50 dark:bg-dodger-300 text-dodger-700 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 text-sm">
                  <span className="block truncate">{t("Select")}</span>
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
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-dodger-50 dark:bg-dodger-300 text-dodger-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {allArtist.map((aa: any) => (
                      <Listbox.Option
                        key={aa.id}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-amber-200 text-amber-900"
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
          </div>
          <div className="w-full mx-auto col-span-2 flex items-center justify-center space-x-4">
            <select
              defaultValue={itemsPerPage}
              name="itemsPerPage"
              onChange={handleChange}
              className="rounded-lg py-2 px-3 bg-dodger-50 dark:bg-dodger-300 text-dodger-700 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 text-sm"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="1000">1000</option>
            </select>
            <button
              type="submit"
              className="rounded-lg py-2 px-3 bg-dodger-50 dark:bg-dodger-300  shadow-md text-center text-dodger-700 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 text-sm"
            >
              {t("Submit")}
            </button>
          </div>
        </Form>

        <table className="w-full text-sm text-left text-dodger-500 dark:text-dodger-400">
          <thead className="text-xs text-dodger-700 uppercase bg-dodger-50 dark:bg-dodger-700 dark:text-dodger-400">
            <tr>
              <th scope="col" className="px-6 py-3 hidden lg:table-cell">
                {t("Release Date")}
              </th>
              <th scope="col" className="px-6 py-3 hidden md:table-cell">
                {t("Title")}
              </th>
              <th scope="col" className="px-6 py-3">
                {t("Views")}
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(youtubeInfos) &&
              youtubeInfos.map((yinfo) => (
                <tr
                  className="bg-white border-b dark:bg-dodger-800 dark:border-dodger-700"
                  key={yinfo.youtubeTitle}
                >
                  <td className="text-left px-6 py-4 text-dodger-800 dark:text-dodger-300 hidden lg:table-cell">
                    {new Date(yinfo.youtubePublishedAt).toLocaleDateString(
                      formatLocale
                    )}
                  </td>
                  <td className="text-left px-6 py-4 text-dodger-800 dark:text-dodger-300 hidden md:table-cell">
                    {yinfo.youtubeTitle}
                  </td>

                  <td className="px-6 py-4 w-96">
                    <div className="relative">
                      <span className="text-dodger-900 z-10 relative ml-2">
                        {new Intl.NumberFormat(formatLocale, {
                          notation: "compact",
                          maximumFractionDigits: 1,
                        }).format(Number(yinfo.youtubeViewCount))}
                      </span>

                      <div
                        className="absolute inset-0 bg-dodger-300 h-6 w-full z-1 rounded-sm"
                        style={{
                          width: `${
                            (yinfo.youtubeViewCount / firstView) * 100
                          }%`,
                        }}
                      ></div>
                      <div className="pt-4 space-y-2 text-dodger-800 dark:text-dodger-300 md:hidden">
                        <div>
                          {new Date(
                            yinfo.youtubePublishedAt
                          ).toLocaleDateString(formatLocale)}
                        </div>
                        <div>{yinfo.youtubeTitle}</div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <MyPagination
          page={page}
          itemsPerPage={itemsPerPage}
          total_pages={Math.ceil(Number(totalVidoes) / itemsPerPage)}
          id={id}
        />
      </section>
    </div>
  );
}

export default StatsHome;
