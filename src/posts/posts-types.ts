export interface PostType {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
}

export interface PostDBType {
  posts: PostType[];
}
