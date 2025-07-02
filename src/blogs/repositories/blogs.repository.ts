import { BlogInputDto } from "../types/blogs-types";
import { BlogType, BlogViewModel } from "../types/blogs-types";
import { blogCollection } from "../../db/mongo.db";
import { ObjectId } from "mongodb";

export const blogsRepository = {
  async create(newBlog: BlogType): Promise<BlogViewModel> {
    const insertResult = await blogCollection.insertOne(newBlog);
    const insertedId = insertResult.insertedId;
    return {
      id: insertedId.toString(),
      name: newBlog.name,
      description: newBlog.description,
      websiteUrl: newBlog.websiteUrl,
      createdAt: newBlog.createdAt,
      isMembership: newBlog.isMembership,
    };
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
      },
    );
    if (updateResult.matchedCount < 1) {
      return null;
    }
    return;
  },

  async delete(id: string): Promise<void | null> {
    const deleteResult = await blogCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (deleteResult.deletedCount < 1) {
      return null;
    }
    return;
  },
};
