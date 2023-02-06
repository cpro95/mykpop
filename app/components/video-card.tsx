import React from "react";
import type { YoutubeInfo } from "@prisma/client";
import { useTranslation } from "react-i18next";

function VideoCard({ mv }: { mv: YoutubeInfo }) {
  const { i18n } = useTranslation();
  let formatLocale = "";
  i18n.language === "ko" ? (formatLocale = "ko-KR") : (formatLocale = "en-US");

  return (
    <div className="mx-auto max-w-xs overflow-hidden rounded-lg bg-white shadow-lg dark:bg-dodger-700">
      {mv.youtubeThumbnail && (
        <img
          // className="w-full object-cover"
          className="h-auto max-w-full"
          src={mv.youtubeThumbnail}
          alt={mv.youtubeTitle}
        />
      )}

      <div className="py-5 text-center">
        <div className="block h-20 text-lg font-semibold text-dodger-800 dark:text-dodger-300">
          {mv.youtubeTitle}
        </div>
        <div className="mx-14 flex items-center justify-between">
          <h6 className="text-sm text-dodger-700 dark:text-dodger-400">
            {new Date(mv.youtubePublishedAt).toLocaleDateString(formatLocale)}
          </h6>

          <h6 className="text-sm font-bold text-dodger-900 dark:text-dodger-300">
            {new Intl.NumberFormat(formatLocale, {
              notation: "compact",
              maximumFractionDigits: 1,
            }).format(Number(mv.youtubeViewCount))}
          </h6>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
