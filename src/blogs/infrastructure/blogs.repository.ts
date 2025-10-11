import { Blog, BlogInputDto } from "../types/blogs-types";
import { blogCollection } from "../../db/mongo.db";
import { ObjectId, WithId } from "mongodb";

export class BlogsRepository {
  async create(newBlog: BlogInputDto): Promise<string> {
    const insertResult = await blogCollection.insertOne(newBlog);
    return insertResult.insertedId.toString();
  }

  async findById(id: string): Promise<WithId<Blog> | false> {
    const blog = await blogCollection.findOne({ _id: new ObjectId(id) });
    if (!blog) {
      return false;
    }
    return blog;
  }

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
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await blogCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  }
}
