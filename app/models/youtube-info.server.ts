import type { YoutubeInfo } from "@prisma/client";

import { prisma } from "~/utils/db.server";
import { getYoutubeApiInfoById } from "../utils/youtube-api.server";
import type { YoutubeApiInfo } from "../utils/youtube-api.server";

export function getYoutubeInfoByVideoId(videoId: string) {
  return prisma.youtubeInfo.findFirst({
    where: { videoId },
  });
}

export async function createYoutubeInfo(
  artistId: string,
  videoId: string,
  youtubeId: string
) {
  const currentYoutubeInfo = await getYoutubeApiInfoById(youtubeId);

  return prisma.youtubeInfo.create({
    data: {
      youtubeId,
      youtubeTitle: currentYoutubeInfo.youtubeTitle,
      youtubeDescription: currentYoutubeInfo.youtubeDescription,
      youtubePublishedAt: new Date(currentYoutubeInfo.youtubePublishedAt),
      youtubeThumbnail: currentYoutubeInfo.youtubeThumbnail,
      youtubeViewCount: currentYoutubeInfo.youtubeViewCount,
      youtubeLikeCount: currentYoutubeInfo.youtubeLikeCount,
      youtubeCommentCount: currentYoutubeInfo.youtubeCommentCount,
      video: {
        connect: {
          id: videoId,
        },
      },
      artist: {
        connect: {
          id: artistId,
        },
      },
    },
  });
}

export async function updateYoutubeInfo(
  youtubeInfoId: string,
  youtubeId: string
) {
  const currentYoutubeInfo = await getYoutubeApiInfoById(youtubeId);

  return prisma.youtubeInfo.update({
    where: { id: youtubeInfoId },
    data: {
      youtubeViewCount: Number(currentYoutubeInfo.youtubeViewCount),
      youtubeLikeCount: Number(currentYoutubeInfo.youtubeLikeCount),
      youtubeCommentCount: Number(currentYoutubeInfo.youtubeCommentCount),
    },
  });
}

export async function updateYoutubeInfosByArtistId(artistId: string) {
  // Need : youtubeInfoId, youtubeId
  const neededData = await prisma.youtubeInfo.findMany({
    where: { artistId },
    select: { id: true, youtubeId: true },
  });

  await Promise.all(
    neededData.map(
      (item: any): Promise<YoutubeApiInfo> =>
        updateYoutubeInfo(item.id, item.youtubeId)
    )
  );
}

export async function updateYoutubeInfosAll() {
  // Need : youtubeId
  const neededData = await prisma.youtubeInfo.findMany({
    select: { id: true, youtubeId: true },
  });

  console.log(neededData);
  await Promise.all(
    neededData.map(
      (item: any): Promise<YoutubeApiInfo> =>
        updateYoutubeInfo(item.id, item.youtubeId)
    )
  );
}

export async function getAllYoutubeInfosByArtistId(artistId: string, q: string,
  page: number,
  itemsPerPage: number, sorting: string, role: string) {
  let x = {};
  let select = {
    select: {
      id: true,
      youtubeId: true,
      youtubeTitle: true,
      // youtubeDescription: true,
      youtubePublishedAt: true,
      youtubeThumbnail: true,
      youtubeViewCount: true,
      youtubeLikeCount: true,
      youtubeCommentCount: true,
      // createdAt: true,
      // updatedAt: true,
      artist: {
        select: { id: true, name: true, nameKor: true, company: true },
      },
      video: {
        select: {
          id: true,
          title: true,
          role: true,
        },
      },
    },
  };

  let pageAndItemsPerPage = {
    skip: page === 1 ? 0 : (page - 1) * itemsPerPage,
    take: itemsPerPage,
  };

  let whereQuery = {};
  if (q === "" && role === "all") {
    whereQuery = {
      where: {
        artist: {
          id: artistId
        },
      },
    };
  } else if (q !== "" && role === "all") {
    whereQuery = {
      where: {
        AND: [
          {
            artist: { id: artistId },
          },
          {
            OR: [
              {
                youtubeTitle: {
                  contains: q,
                },
              },
              {
                video: {
                  title: {
                    contains: q,
                  }
                }
              },
            ]
          },
        ]
      },
    };
  } else if (q === "" && role !== "all") {
    whereQuery = {
      where: {
        AND: [
          {
            artist: {
              id: artistId
            },
          },
          {
            video: { role }
          }
        ]
      },
    };
  } else if (q !== "" && role !== "all") {
    whereQuery = {
      where: {
        AND: [
          {
            AND: [
              {
                artist: { id: artistId },
              },
              { video: { role } }
            ],
          },
          {
            OR: [
              {
                youtubeTitle: {
                  contains: q,
                },
              },
              {
                video: {
                  title: {
                    contains: q,
                  }
                }
              },
            ]
          },
        ]
      },
    };
  }
  let orderBy = {};
  if (sorting === "date") {
    orderBy = { orderBy: { youtubePublishedAt: "desc" } };
  } else orderBy = { orderBy: { youtubeViewCount: "desc" } };

  Object.assign(x, orderBy, select, whereQuery, pageAndItemsPerPage);
  return prisma.youtubeInfo.findMany(x);
}

export async function getAllYoutubeInfosByNone(q: string,
  page: number,
  itemsPerPage: number, sorting: string, role: string) {
  let x = {};
  let select = {
    select: {
      id: true,
      youtubeId: true,
      youtubeTitle: true,
      // youtubeDescription: true,
      youtubePublishedAt: true,
      youtubeThumbnail: true,
      youtubeViewCount: true,
      youtubeLikeCount: true,
      youtubeCommentCount: true,
      // createdAt: true,
      // updatedAt: true,
      artist: {
        select: { id: true, name: true, nameKor: true, company: true },
      },
      video: {
        select: {
          id: true,
          title: true,
          role: true,
        },
      },
    },
  };

  let pageAndItemsPerPage = {
    skip: page === 1 ? 0 : (page - 1) * itemsPerPage,
    take: itemsPerPage,
  };
  let whereQuery = {};
  if (q !== "" && role === "all") {
    whereQuery = {
      where: {
        OR: [
          {
            youtubeTitle: {
              contains: q,
            },
          },
          {
            video: {
              title: {
                contains: q,
              }
            }
          },
        ]
      },
    }
  }
  else if (q === "" && role !== "all") {
    whereQuery = {
      where: {
        video: {
          role
        }
      },
    };
  } else if (q !== "" && role !== "all") {
    whereQuery = {
      where: {
        AND: [
          {
            video: { role }
          },
          {
            OR: [
              {
                youtubeTitle: {
                  contains: q,
                },
              },
              {
                video: {
                  title: {
                    contains: q,
                  }
                }
              },
            ]
          }]
      },
    };
  }

  let orderBy = {};
  if (sorting === "date") {
    orderBy = {
      orderBy: { youtubePublishedAt: "desc" }
    };
  } else orderBy = { orderBy: { youtubeViewCount: "desc" } };

  Object.assign(x, select, whereQuery, orderBy, pageAndItemsPerPage);
  return prisma.youtubeInfo.findMany(x);
}


export async function getCountInStatPageData(ids: string[], role: string) {
  let whereQuery = {};
  if (ids.length === 0 && role === "all") {
    whereQuery = {
      where: {

      },
    };
  } else if (ids.length === 0 && role !== "all") {
    whereQuery = {
      where: {
        video: { role }
      }
    }
  } else if (ids.length !== 0 && role !== "all") {
    whereQuery = {
      where: {
        AND: [
          {
            OR: ids.map((id: any) => ({
              artist: { id },
            })),
          },
          { video: { role } }
        ]
      },
    };
  }
  else if (ids.length !== 0 && role === "all") {
    whereQuery = {
      where: {
        OR: ids.map((id: any) => ({
          artist: { id },
        })),
      },
    };
  }

  let x = {};

  Object.assign(x, whereQuery);
  // console.log(x);
  const data = await prisma.youtubeInfo.count(x);

  return data;
}

export async function getStatPageData(
  page: number,
  itemsPerPage: number, ids: string[], role: string
) {

  let whereQuery = {};
  if (ids.length === 0 && role === "all") {
    whereQuery = {
      where: {

      },
    };
  } else if (ids.length === 0 && role !== "all") {
    whereQuery = {
      where: {
        video: { role }
      }
    }
  } else if (ids.length !== 0 && role !== "all") {
    whereQuery = {
      where: {
        AND: [
          {
            OR: ids.map((id: any) => ({
              artist: { id },
            })),
          },
          { video: { role } }
        ]
      },
    };
  }
  else if (ids.length !== 0 && role === "all") {
    whereQuery = {
      where: {
        OR: ids.map((id: any) => ({
          artist: { id },
        })),
      },
    };
  }

  let x = {};
  let selectQuery = {
    select: {
      id: true,
      youtubeId: true,
      youtubeTitle: true,
      youtubePublishedAt: true,
      youtubeThumbnail: true,
      youtubeViewCount: true,
      youtubeLikeCount: true,
      youtubeCommentCount: true,
      artist: {
        select: {
          id: true,
          name: true,
          nameKor: true,
          company: true,
        }
      },
      video: {
        select: {
          id: true,
          title: true,
          role: true,
        }
      },
    },
    orderBy: { youtubeViewCount: "desc" },
    skip: page === 1 ? 0 : (page - 1) * itemsPerPage,
    take: itemsPerPage,
  }
  Object.assign(x, selectQuery, whereQuery);
  // console.log(x);
  const data = await prisma.youtubeInfo.findMany(x);

  // console.log(data);
  return data;
}

export async function getYoutubeInfos(videoId: string) {
  const data = await prisma.youtubeInfo.findMany({
    where: { videoId },
  });

  // console.log(data);
  return data[0];
}

export async function getYoutubeApiInfosByIdArray(
  allVideos: Array<{ id: string }>
) {
  let youtubeInfos: Array<YoutubeInfo>;

  youtubeInfos = await Promise.all(
    allVideos.map(
      async (item): Promise<YoutubeInfo> => await getYoutubeInfos(item.id)
    )
  );

  youtubeInfos.sort((a, b) => {
    if (a.youtubePublishedAt < b.youtubePublishedAt) {
      return 1;
    }
    if (a.youtubePublishedAt > b.youtubePublishedAt) {
      return -1;
    }
    // a must be equal to b
    return 0;
  });

  return youtubeInfos;
}

export async function getYoutubeInfoCount() {
  return prisma.youtubeInfo.count();
}

export async function getTopViewCount() {
  return prisma.youtubeInfo.findFirst({
    select: { youtubeViewCount: true },
    orderBy: { youtubeViewCount: 'desc' }
  });
}

export async function getAllYoutubeInfosCountByArtistId(artistId: string, q: string, role: string) {

  if (q === "" && role === "all")
    return prisma.youtubeInfo.count({ where: { artist: { id: artistId } } })
  else if (q !== "" && role === "all")
    return prisma.youtubeInfo.count({
      where: {
        AND: [
          {
            artist: { id: artistId },
          },
          {
            OR: [
              {
                youtubeTitle: {
                  contains: q,
                },
              },
              {
                video: {
                  title: {
                    contains: q,
                  },
                },
              }
            ],
          },
        ]
      },
    })
  else if (q === "" && role !== "all")
    return prisma.youtubeInfo.count({
      where: {
        AND: [
          {
            artist: { id: artistId },
          },
          { video: { role } }
        ],
      }
    });
  else if (q !== "" && role !== "all")
    return prisma.youtubeInfo.count({
      where: {
        AND: [
          {
            AND: [
              {
                artist: { id: artistId },
              },
              { video: { role } }
            ],
          }, {
            OR: [
              {
                youtubeTitle: {
                  contains: q,
                },
              },
              {
                video: {
                  title: {
                    contains: q,
                  },
                },
              }
            ],
          }
        ]
      },
    })
}

export async function getAllYoutubeInfosCountByNone(q?: string, role?: string) {
  if (q === "" && role === "all") return prisma.youtubeInfo.count();
  else if (q === "" && role !== "all")
    return prisma.youtubeInfo.count({
      where: { video: { role } }
    });
  else if (q !== "" && role === "all")
    return prisma.youtubeInfo.count({
      where: {
        OR: [
          {
            youtubeTitle: {
              contains: q,
            },
          },
          {
            video: {
              title: {
                contains: q,
              },
            },
          }
        ],
      },
    })

  else if (q !== "" && role !== "all")
    return prisma.youtubeInfo.count({
      where: {
        AND: [
          {
            video: { role }
          },
          {
            OR: [
              {
                youtubeTitle: {
                  contains: q,
                },
              },
              {
                video: {
                  title: {
                    contains: q,
                  },
                },
              }
            ]
          }],
      },
    })
}