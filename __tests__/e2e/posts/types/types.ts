export interface PostAttributes {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
}

export interface PostCreateInput {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}
