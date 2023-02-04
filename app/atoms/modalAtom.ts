import { atom } from "recoil";
import type { YoutubeInfo } from "~/models/youtubeApi.server";

export const modalState = atom({
    key: 'modalState',
    default: false
})

export const videoState = atom<YoutubeInfo | null>({
    key: 'videoState',
    default: null
})