import { BlogViewModel } from "../types/blogs-types";
import { ObjectId } from "mongodb";
import { injectable } from "inversify";
import { BlogDocument } from "../domain/blogDomainModel";
import { BlogModel } from "../domain/blogDomainModel";

@injectable()
export class BlogsRepository {
  async save(newBlog: BlogDocument): Promise<string> {
    await newBlog.save();
    return newBlog._id.toString();
  }

  async findById(id: string): Promise<BlogViewModel | false> {
    console.log(id, "id check dal");
    const blog = await BlogModel.findById(id).lean();
    console.log(blog, "DAL");
    if (!blog) {
      return false;
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

