export type gotParamsType = {
  q?: string;
  page: number;
  itemsPerPage: number;
  sorting?: string;
  id?: string | undefined;
  role?: string | undefined;
};

export type YoutubeInfo = {
  id: string;
  youtubeId: string;
  youtubeTitle: string;
  youtubeDescription?: string;
  youtubePublishedAt: Date;
  youtubeThumbnail: string;
  youtubeViewCount: number;
  youtubeLikeCount: number;
  youtubeCommentCount: number;
  createdAt?: Date;
  updatedAt?: Date;
  artist: {
    id: string;
    name: string;
    nameKor: string;
    company: string;
  };
  video: {
    id: string;
    title: string;
    role: string;
  };
};