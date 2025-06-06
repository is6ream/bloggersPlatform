import { BlogType } from "../types/blogs-types";
import { BlogInputDto } from "../types/blogs-types";
import { blogCollection } from "../../db/mongo.db";
import { ObjectId, WithId } from "mongodb";
import { BlogViewModel } from "../types/blogs-types";

export const blogsRepository = {
  async findAll(): Promise<WithId<BlogViewModel>[]> {
    return blogCollection.find().toArray();
  },

  async findById(id: string): Promise<BlogViewModel | null> {
    const blog = await blogCollection.findOne({ _id: new ObjectId(id) });
    if (!blog) {
      return null;
    }
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
  },

  async create(newBlog: BlogType): Promise<WithId<BlogViewModel>> {
    const insertResult = await blogCollection.insertOne(newBlog);

    return { ...newBlog, _id: insertResult.insertedId };
  },

  async update(id: string, dto: BlogInputDto): Promise<void> {
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
      throw new Error("Blog not exist");
    }
    return;
  },

  async delete(id: string): Promise<void> {
    const deleteResult = await blogCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (deleteResult.deletedCount < 1) {
      throw new Error("Blog not exist");
    }
    return;
  },

  async deleteAll(): Promise<boolean> {
    return await blogCollection.drop();
  },
};
