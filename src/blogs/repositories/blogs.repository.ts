import { BlogType } from "../types/blogs-types";
import { BlogInputDto } from "../types/blogs-types";
import { blogCollection } from "../../db/mongo.db";
import { DeleteResult, ObjectId } from "mongodb";
import { BlogViewModel } from "../types/blogs-types";
import { BlogQueryInput } from "../routes/input/blog-query.input";
import { WithId } from "mongodb";

export const blogsRepository = {
  async findAll(
    queryDto: BlogQueryInput,
  ): Promise<{ items: WithId<BlogType>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchBlogNameTerm } =
      queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    if (searchBlogNameTerm) {
      filter.name = { $regex: searchBlogNameTerm, $options: "i" };
    }

    const items = await blogCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await blogCollection.countDocuments(filter);

    return { items, totalCount };
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

  async findByBlogId(blogId: string): Promise<BlogViewModel | null> {
    const blog = await blogCollection.findOne({ _id: new ObjectId(blogId) }); //правильно
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

  async deleteAll(): Promise<DeleteResult> {
    return await blogCollection.deleteMany();
  },
};
