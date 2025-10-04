import { blogCollection } from "../../db/mongo.db";
import { BlogQueryInput } from "../routes/input/blog-query.input";
import { WithId } from "mongodb";
import { BlogDB, BlogViewModel } from "../types/blogs-types";
import { ObjectId } from "mongodb";

class BlogQueryRepository {
  async findAll(
    queryDto: BlogQueryInput,
  ): Promise<{ items: WithId<BlogDB>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    if (searchNameTerm) {
      filter["name"] = { $regex: searchNameTerm, $options: "i" };
    }
    const items = await blogCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize)
      .toArray();
    const totalCount = await blogCollection.countDocuments(filter);
    return { items, totalCount };
  }

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
  }

  async findByBlogId(blogId: string): Promise<BlogViewModel | null> {
    const blog = await blogCollection.findOne({ _id: new ObjectId(blogId) });
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
  }
}

export const blogQueryRepository = new BlogQueryRepository();
