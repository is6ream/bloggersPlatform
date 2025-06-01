import { BlogDBType } from "../blogs/types/blogs-types";
import { PostDBType } from "../posts/posts-types";

export interface DBType extends PostDBType, BlogDBType {}

export const db: DBType = {
  blogs: [
    {
      id: "123",
      name: "name",
      description: "description",
      websiteUrl: "http://jam.com",
    },
  ],

  posts: [
    {
      id: "123",
      title: "football",
      shortDescription: "best game",
      content: "yt",
      blogId: "23",
      blogName: "danil",
    },
  ],
};
