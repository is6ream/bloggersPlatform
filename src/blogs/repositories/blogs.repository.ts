import { BlogType } from "../types/blogs-types";
import { BlogInputDto } from "../types/blogs-types";
import { blogCollection } from "../../db/mongo.db";
import { ObjectId, WithId } from "mongodb";

export const blogsRepository = {
  async findAll(): Promise<WithId<BlogType>[]> {
    return blogCollection.find().toArray();
  },

  findById(id: string): Promise<WithId<BlogType> | null> {
    return blogCollection.findOne({ _id: new ObjectId(id) });
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

  delete(id: string) {
    const index = db.blogs.findIndex((b) => b.id === id);

    if (index === -1) {
      throw new Error("Video not exist");
    }

    return db.blogs.splice(index, 1);
  },

  deleteAll() {
    return (db.blogs = []);
  },
};
