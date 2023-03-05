export type gotParamsType = {
  q?: string | undefined | null;
  page: number;
  itemsPerPage: number;
  sorting?: string;
  id?: string | undefined | null;
  role? : string;
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