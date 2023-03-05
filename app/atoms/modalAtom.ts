import { atom } from "recoil";
import { YoutubeInfo } from "~/utils/types";

export const modalState = atom({
  key: "modalState",
  default: false,
});

export const videoState = atom<YoutubeInfo | null>({
  key: "videoState",
  default: null,
});
