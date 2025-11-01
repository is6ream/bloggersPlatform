import { BlogInputDto, BlogViewModel } from "../types/blogs-types";
import { ObjectId } from "mongodb";
import { injectable } from "inversify";
import { BlogDocument } from "../types/mongoose";
import { BlogModel } from "../types/mongoose";

@injectable()
export class BlogsRepository {
  async save(newBlog: BlogDocument): Promise<string> {
    await newBlog.save();
    return newBlog._id.toString();
  }

  async findById(id: string): Promise<BlogViewModel | false> {
    const blog = await BlogModel.findOne({ _id: new ObjectId(id) }).lean();
    if (!blog) {
      return false;
    }
    return {
      //todo убрать маппинг из репозитория
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
  }

  async update(blog: BlogDocument): Promise<boolean> {
    await blog.save();
    return true;
  } //todo убрать

  async delete(id: string): Promise<boolean> {
    const deleteResult = await BlogModel.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  }
}
