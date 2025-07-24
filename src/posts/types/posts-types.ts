export interface PostType {
  id?: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
}

export interface PostViewModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
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
  posts: PostType[];
}
