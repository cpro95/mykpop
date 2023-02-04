import type { Artist } from "@prisma/client";
import { prisma } from "~/utils/db.server";
export type { Artist, Note } from "@prisma/client";

// export function getNoteListItems({ userId }: { userId: User["id"] }) {
//     return prisma.note.findMany({
//         where: { userId },
//         select: { id: true, title: true },
//         orderBy: { updatedAt: "desc" },
//     });
// }

export function createArtist(
    name: string, nameKor: string, artistLogo: string, artistPoster: string, company: string) {
    return prisma.artist.create({
        data: {
            name,
            nameKor,
            artistLogo,
            artistPoster,
            company,
        },
    });
}

export function updateArtist(id: string, name: string, nameKor: string, artistLogo: string, artistPoster: string, company: string) {

    return prisma.artist.update({
        where: { id },
        data: {
            name,
            nameKor,
            artistLogo,
            artistPoster,
            company,
        },
    });
}

export function deleteArtist({
    id,
}: Pick<Artist, "id">) {
    return prisma.artist.deleteMany({
        where: { id },
    });
}

export function getArtist(
    id: string
) {
    return prisma.artist.findFirst({
        where: { id },
    });
}

// export async function getNotes({ userId }: { userId: User["id"] }) {
//     return prisma.note.findMany({
//         where: { userId },
//         select: { id: true, title: true, updatedAt: true, userId: true },
//         orderBy: { updatedAt: "desc" },
//     });
// }

export async function getArtistWithUserId(
    id: string
) {
    return prisma.artist.findFirst({
        where: { id },
    })
}

export async function getArtistsIdAndName() {
    return prisma.artist.findMany({
        select: { id: true, name: true },
    })
}


export async function getAllArtist(query: string, page: number, itemsPerPage: number) {
    let x = {}
    let select = {
        select: {
            id: true, name: true, nameKor: true, artistLogo: true, artistPoster: true, company: true, updatedAt: true, _count: {
                select: {
                    videos: true
                }
            }
        }

    }

    let pageAndItemsPerPage = {
        skip: page === 1 ? 0 : (page - 1) * itemsPerPage,
        take: itemsPerPage
    };

    let whereQuery = {
        where: {
            OR: [
                {
                    name: {
                        contains: query,

                    },
                },
                {
                    nameKor: {
                        contains: query,
                    },
                },
            ],
        }
    };

    let orderBy = { orderBy: { updatedAt: "desc" } };

    if (query === "")
        Object.assign(x, pageAndItemsPerPage, select, orderBy);
    else Object.assign(x, select, whereQuery, orderBy);

    return prisma.artist.findMany(x);
}

export async function getArtistCount() {
    return prisma.artist.count();
}

// export async function getNoteCountById(id: string) {
//     return prisma.note.count({ where: { userId: id } })
// }

