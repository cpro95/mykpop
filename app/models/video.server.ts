import type { Artist, Video, User } from "@prisma/client";
import { prisma } from "~/utils/db.server";
export type { Video } from "@prisma/client";

export function getVideoListByArtist({ artistId }: { artistId: Artist["id"] }) {
    return prisma.video.findMany({
        where: { artistId },
        select: { id: true, title: true },
        orderBy: { updatedAt: "desc" },
    });
}

export function createVideo(artistId: string, title: string, youtube_id: string) {
    return prisma.video.create({
        data: {
            title,
            youtube_id,
            artist: {
                connect: {
                    id: artistId,
                }
            }
        },
    });
}

export function updateVideo(id: string, title: string, role: string, youtube_id: string) {
    return prisma.video.update({
        where: { id },
        data: {
            title,
            role,
            youtube_id
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

export function getVideosOfArtistId(id: string) {
    return prisma.video.findMany({
        where: { artistId: id }
    })
}

export async function getNotes({ userId }: { userId: User["id"] }) {
    return prisma.note.findMany({
        where: { userId },
        select: { id: true, title: true, updatedAt: true, userId: true },
        orderBy: { updatedAt: "desc" },
    });
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
            id: true, title: true, role: true, youtube_id: true, updatedAt: true, artist: {
                select: { name: true, name_kor: true, company: true }
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

export async function getVideoCount() {
    return prisma.video.count();
}

export async function getVideoCountByArtistId(id: string) {
    return prisma.video.count({ where: { artistId: id } })
}