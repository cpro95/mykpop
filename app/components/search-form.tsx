import { Form, useSubmit, useTransition } from "@remix-run/react";
import type { FormMethod } from "@remix-run/react";
import type { gotParamsType } from "~/utils/types";
import { useTranslation } from "react-i18next";

export default function SearchForm({
  method,
  action,
  gotParams,
  showSorting = true,
}: {
  method?: FormMethod;
  action?: string;
  gotParams: gotParamsType;
  showSorting: boolean;
}) {
  const transition = useTransition();
  const { t } = useTranslation();

  let isSubmitting =
    transition.state === "submitting" || transition.state === "loading";

  const submit = useSubmit();
  function handleChange(e: any) {
    let x = {
      q: gotParams.q || "",
      page: String(gotParams.page),
      itemsPerPage: String(gotParams.itemsPerPage),
      sorting: gotParams.sorting || "",
    };
    x.sorting = e.target.value;
    // console.log("inside search-form x is ========>", x);
    submit(x, { replace: true });
  }

  return (
    <Form
      method={method}
      action={action}
      replace
      reloadDocument
      className="pt-8"
    >
      <div className="flex-cols mx-auto flex w-full">
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
            className="search-label"
            placeholder={t("Search")!}
            type="text"
            name="q"
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
        {showSorting && (
          <div className="ml-2 sm:ml-4 md:ml-6 flex items-center justify-center mr-2">
            <select
              name="sorting"
              onChange={handleChange}
              className="bg-transparent font-medium text-gray-700 focus:outline-none dark:text-gray-300"
            >
              <option value="date" selected={gotParams.sorting === "date"}>
                {t("Date")}
              </option>

              <option value="views" selected={gotParams.sorting === "views"}>
                {t("Views")}
              </option>
            </select>
          </div>
        )}
      </div>
    </Form>
  );
}
