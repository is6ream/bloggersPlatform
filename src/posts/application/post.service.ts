import { Result } from "../../core/result/result.type";
import { PostByIdInputDto } from "../types/posts-types";
import { PostInputDto } from "../types/posts-types";
import { postRepository } from "../infrastructure/postRepository";
import { blogsRepository } from "../../blogs/infrastructure/blogs.repository";
import { blogQueryRepository } from "../../blogs/infrastructure/blogs.query.repository";
import {
  handleBadRequestResult,
  handleNotFoundResult,
  handleSuccessResult,
} from "../../core/result/handleResult";

class PostService {
  async create(dto: PostInputDto): Promise<Result<string>> {
    const foundBlog = await blogsRepository.findById(dto.blogId);
    if (!foundBlog) {
      return handleBadRequestResult("blog not found", "blogId");
    }
    await postRepository.create({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: foundBlog.name,
      createdAt: new Date(),
    });

    return handleSuccessResult();
  }

  async createPostByBlogId(
    blogId: string,
    dto: PostByIdInputDto,
  ): Promise<Result<string>> {
    const blog = await blogQueryRepository.findById(blogId);
    if (!blog) {
      return handleBadRequestResult("blog not found", "blogId");
    }
    await postRepository.create({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: blogId,
      blogName: blog.name,
      createdAt: new Date(),
    });
    return handleSuccessResult();
  }

  async update(id: string, dto: PostInputDto): Promise<Result> {
    const result = await postRepository.update(id, dto);
    if (!result) {
      return handleNotFoundResult("Post not found", "postId");
    }
    return handleSuccessResult();
  }

  async delete(id: string): Promise<Result> {
    const result = await postRepository.delete(id);
    if (!result) {
      return handleNotFoundResult("Post not found", "postId");
    }
    return handleSuccessResult();
  }
}

export const postsService = new PostService();
