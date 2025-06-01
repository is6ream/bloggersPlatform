import { db } from "../../db/db";
import { PostType } from "../posts-types";

interface PostInputDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

export const postRepository = {
  findAll(): PostType[] {
    return db.posts;
  },

  findById(id: string): PostType | null {
    return db.posts.find((p) => p.id === id) ?? null;
  },

  create(newPost: PostType) {
    db.posts.push(newPost);
    return newPost;
  },

  update(id: string, dto: PostInputDto): void {
    const post = db.posts.find((p) => p.id === id);

    if (!post) {
      throw new Error("Post not exist");
    }

    post.title = dto.title || post.title;
    post.shortDescription = dto.shortDescription || post.shortDescription;
    post.content = dto.content || post.content;
    post.blogId = dto.blogId || post.blogId;
    return;
  },

  delete(id: string) {
    const index = db.posts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("Post not exist");
    }
    return db.posts.splice(index, 1);
  },
};
