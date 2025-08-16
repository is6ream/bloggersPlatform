import { Result } from "./../../core/result/result.type";
import { PostByIdInputDto } from "./../types/posts-types";
import { PostInputDto } from "../types/posts-types";
import { postRepository } from "../repositories/postRepository";
import { ResultStatus } from "../../core/result/resultCode";
import { blogsRepository } from "../../blogs/repositories/blogs.repository";

export const postsService = {
  async create(dto: PostInputDto): Promise<Result<string>> {
    const foundBlog = await blogsRepository.findById(dto.blogId);

    if (!foundBlog) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Not found",
        extensions: [{ field: null, message: "Blog not found" }],
      };
    }
    const postId = await postRepository.create({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: foundBlog.name,
      createdAt: new Date(),
    });

    return {
      status: ResultStatus.Success,
      data: postId,
      extensions: [],
    };
  },

  async createPostByBlogId(
    blogId: string,
    dto: PostByIdInputDto
  ): Promise<Result<string>> {
    const blog = await blogsRepository.findById(blogId);
    if (!blog) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "Not found",
        extensions: [{ field: null, message: "Blog not found" }],
      };
    }
    const postId = await postRepository.create({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: blogId,
      blogName: blog.name,
      createdAt: new Date(),
    });
    return {
      status: ResultStatus.Success,
      data: postId,
      extensions: [],
    };
  },

  async update(id: string, dto: PostInputDto): Promise<Result> {
    const result = await postRepository.update(id, dto);
    if (!result) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "Post not found",
        extensions: [{ field: null, message: "Blog not found " }],
      };
    }
    return {
      status: ResultStatus.Success,
      extensions: [],
    };
  },

  async delete(id: string): Promise<boolean> {
    return await postRepository.delete(id);
  },
};
