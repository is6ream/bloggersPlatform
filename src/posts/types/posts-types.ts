export interface PostDB {
  id?: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };
}

export interface PostViewModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikeInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: [
      {
        addedAt: Date;
        userId: string;
        login: string;
      },
    ];
  };
}

export interface PostInputDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

export type PostByIdInputDto = {
  title: string;
  shortDescription: string;
  content: string;
};

export interface PostDBType {
  posts: PostDB[];
}
