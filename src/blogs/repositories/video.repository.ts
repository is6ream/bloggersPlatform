import { db } from "../../db";
import { BlogType } from "../../core/video-types";

interface BlogInputDto{
      name: string,
      description: string,
      websiteUrl: string
    }

export const blogsRepository = {

  findAll(): BlogType[] {
    return db.blogs;
  },

  findById(id: number): BlogType | null {
    return db.blogs.find((b) => b.id === id) ?? null;
  },  

  create(newBlog: BlogInputDto): BlogDBType {
    db.blogs.push(newBlog);
    return newBlog;
  }, //остановился на разборе этой ошибки

  update(id: number, dto: ): void {
    const blog = db.blogs.find((b) => b.id === id);

    if (!blog) {
      throw new Error("Video not exist");
    }
    findBlog.name = req.body.name || findBlog.name;
    findBlog.description = req.body.description || findBlog.description;
    findBlog.websiteUrl = req.body.websiteUrl || findBlog.websiteUrl;
    return;
  },

  delete(id: number): void {
    const index = db.videos.findIndex((v) => v.id === id);

    if (index === -1) {
      throw new Error("Video not exist");
    }

    db.videos.splice(index, 1);
    return;
  }
    
  }
    