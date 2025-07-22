import { Blog, BlogInputDto } from "../types/blogs-types";
import { CreateBlogDto } from "../types/blogs-types";
import { blogCollection } from "../../db/mongo.db";
import { ObjectId } from "mongodb";

export const blogsRepository = {
  async create(blogData: CreateBlogDto): Promise<Blog> {
    const insertResult = await blogCollection.insertOne(blogData);
    const insertedId = insertResult.insertedId;
    const newBlog = {
      ...blogData,
      id: insertedId.toString(),
    };
    return newBlog;
  },

  async update(id: string, dto: BlogInputDto): Promise<void | null> {
    const updateResult = await blogCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
        },
      }
    );
    if (updateResult.matchedCount < 1) {
      return null;
    }
    return;
  },

  async delete(id: string): Promise<boolean> {
    const deleteResult = await blogCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  },
};
