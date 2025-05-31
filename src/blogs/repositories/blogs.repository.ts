import { db } from "../../db";
import { BlogType } from "../../core/blogs-types";

interface BlogInputDto {
  name: string;
  description: string;
  websiteUrl: string;
}

export const blogsRepository = {
  findAll(): BlogType[] {
    return db.blogs;
  },

  findById(id: string): BlogType | null {
    return db.blogs.find((b) => b.id === id) ?? null;
  },

  create(newBlog: BlogType) {
    db.blogs.push(newBlog);
    return newBlog;
  },

  update(id: string, dto: BlogInputDto): void {
    const blog = db.blogs.find((b) => b.id === id);

    if (!blog) {
      throw new Error("Blog not exist");
    }
    blog.name = dto.name || blog.name;
    blog.description = dto.description || blog.description;
    blog.websiteUrl = dto.websiteUrl || blog.websiteUrl;
    return;
  },

  delete(id: string): void {
    const index = db.blogs.findIndex((b) => b.id === id);

    if (index === -1) {
      throw new Error("Video not exist");
    }

    db.blogs.splice(index, 1);
    return;
  },

  deleteAll(): void {
    db.blogs = [];
    return;
  },
};
