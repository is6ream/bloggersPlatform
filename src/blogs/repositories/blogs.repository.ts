import { BlogType } from "../types/blogs-types";
import { BlogInputDto } from "../types/blogs-types";
import { blogCollection } from "../../db/mongo.db";
import { DeleteResult, ObjectId } from "mongodb";
import { BlogViewModel } from "../types/blogs-types";

export const blogsRepository = {
  async findAll(): Promise<BlogViewModel[]> {
    const blogs = await blogCollection.find().toArray();
    return blogs.map((b) => ({
      id: b._id.toString(),
      name: b.name,
      description: b.description,
      websiteUrl: b.websiteUrl,
      createdAt: b.createdAt,
      isMembership: b.isMembership,
    }));
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
      }
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

  async deleteAll(): Promise<DeleteResult> {
    return await blogCollection.deleteMany();
  },
};
