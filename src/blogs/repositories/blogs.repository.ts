import { BlogInputDto } from "../types/blogs-types";
import { CreateBlogDto } from "../types/blogs-types";
import { blogCollection } from "../../db/mongo.db";
import { ObjectId } from "mongodb";

export const blogsRepository = {  
  async create(newBlog: CreateBlogDto): Promise<string> {
    const insertResult = await blogCollection.insertOne(newBlog);
    const insertedId = insertResult.insertedId;
    return insertedId.toString();
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
