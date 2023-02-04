import type { Video } from "@prisma/client";
import { prisma } from "~/utils/db.server";
export type { Video } from "@prisma/client";


export function createVideo(artistId: string, title: string, youtubeId: string) {
    return prisma.video.create({
        data: {
            title,
            youtubeId,
            artist: {
                connect: {
                    id: artistId,
                }
            }
        },
    });
}

export function updateVideo(id: string, title: string, role: string, youtubeId: string, artistId: string) {
    return prisma.video.update({
        where: { id },
        data: {
            title,
            role,
            youtubeId,
            artistId
        },
    });
}

export function deleteVideo({ id }: Pick<Video, "id">) {
    return prisma.video.deleteMany({
        where: { id },
    });
}

export function getVideo(id: string) {
    return prisma.video.findFirst({
        where: { id },
    });
}

export async function getVideoIdsByArtistId(id: string) {
    return await prisma.video.findMany({
        select: { id: true },
        where: { artistId: id }
    })
}

export async function getVideosOfArtistId(id: string) {
    return await prisma.video.findMany({
        where: { artistId: id }
    })
}

export async function getVideosWithId({ id }: Pick<Video, "id">) {
    return prisma.video.findFirst({
        where: { id },
    })
}

export async function getAllVideo(query: string, page: number, itemsPerPage: number) {
    let x = {}
    let select = {
        select: {
            id: true, title: true, role: true, youtubeId: true, updatedAt: true, artist: {
                select: { name: true, nameKor: true, company: true }
            }
        }
    }

    let pageAndItemsPerPage = {
        skip: page === 1 ? 0 : (page - 1) * itemsPerPage,
        take: itemsPerPage
    };

    let whereQuery = {
        where: {
            title: {
                contains: query,
            },
        }
    };

    let orderBy = { orderBy: { updatedAt: "desc" } };

    if (query === "")
        Object.assign(x, pageAndItemsPerPage, select, orderBy);
    else Object.assign(x, select, whereQuery, orderBy);

    return prisma.video.findMany(x);
}

export async function getAllVideoIds(query: string, page: number, itemsPerPage: number) {
    let x = {}
    let select = {
        select: {
            id: true
        }
    }

    let pageAndItemsPerPage = {
        skip: page === 1 ? 0 : (page - 1) * itemsPerPage,
        take: itemsPerPage
    };

    let whereQuery = {
        where: {
            title: {
                contains: query,
            },
        }
    };

    let orderBy = { orderBy: { updatedAt: "desc" } };

    if (query === "")
        Object.assign(x, pageAndItemsPerPage, select, orderBy);
    else Object.assign(x, select, whereQuery, orderBy);

    return prisma.video.findMany(x);
}

export async function getVideoCount() {
    return prisma.video.count();
}

export async function getVideoCountByArtistId(id: string) {
    return prisma.video.count({ where: { artistId: id } })
}