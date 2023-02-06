import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { getNoteCount } from "~/models/note.server";

export const loader: LoaderFunction = async ({ request }) => {
  const nbOfNotes = await getNoteCount();

  return json({
    nbOfNotes,
  });
};

export default function NoteIndexPage() {
  const { nbOfNotes } = useLoaderData();
  const { t, i18n } = useTranslation();

  return (
    <div className="flex w-full flex-row items-center justify-between bg-dodger-50 dark:bg-dodger-900">
      <div className="text-2xl font-semibold dark:text-gray-200">
        {t("notes-title")}
      </div>
      <div className="dark:text-gray-200">
        {t("Total")} {nbOfNotes} {i18n.language === "ko" ? "개" : ""}
      </div>
    </div>
  );
}
