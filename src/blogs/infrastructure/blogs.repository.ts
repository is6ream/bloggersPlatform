import { BlogInputDto, BlogViewModel } from "../types/blogs-types";
import { blogCollection } from "../../db/mongo.db";
import { ObjectId } from "mongodb";
import { injectable } from "inversify";
import { BlogModel } from "../types/mongoose";

@injectable()
export class BlogsRepository {
  //нужно понять, куда сохраняются данные
  async create(newBlog: BlogInputDto): Promise<string> {
    const blogInstance = new BlogModel();
    //как сделать save через репозиторий?
    blogInstance.name = newBlog.name;
    blogInstance.description = newBlog.description;
    blogInstance.websiteUrl = newBlog.websiteUrl;
    blogInstance.createdAt = newBlog.createdAt;
    blogInstance.isMembership = newBlog.isMembership;

    console.log("Before save - isNew:", blogInstance.isNew); // true
    console.log("Before save - isModified:", blogInstance.isModified()); // true

    await blogInstance.save();

    console.log("After save - isNew:", blogInstance.isNew); // false
    console.log("After save - _id:", blogInstance._id);

    return blogInstance._id.toString();
  }

  async findById(id: string): Promise<BlogViewModel | false> {
    const blog = await BlogModel.findOne({ _id: new ObjectId(id) });
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

  async update(id: string, dto: BlogInputDto): Promise<boolean> {
    const blog = await BlogModel.findOne({ _id: new ObjectId(id) });
    if (!blog) {
      return false;
    }
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;

    blog.save();
    return true;
    // await blogCollection.updateOne(
    //   {
    //     _id: new ObjectId(id),
    //   },
    //   {
    //     $set: {
    //       name: dto.name,
    //       description: dto.description,
    //       websiteUrl: dto.websiteUrl,
    //     },
    //   },
    // );
    // return updateResult.modifiedCount === 1;
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await blogCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  }
}
