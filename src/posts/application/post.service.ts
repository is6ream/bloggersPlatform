import { Result } from "../../core/result/result.type";
import { PostByIdInputDto } from "../types/posts-types";
import { PostInputDto } from "../types/posts-types";
import { PostsRepository } from "../infrastructure/postRepository";
import { BlogsRepository } from "../../blogs/infrastructure/blogs.repository";
import {
  handleBadRequestResult,
  handleNotFoundResult,
  handleSuccessResult,
} from "../../core/result/handleResult";

export class PostsService {
  constructor(
    private postRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}
  async create(dto: PostInputDto): Promise<Result<string>> {
    const foundBlog = await this.blogsRepository.findById(dto.blogId);
    if (!foundBlog) {
      return handleBadRequestResult("blog not found", "blogId");
    }
    await this.postRepository.create({
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
    const blog = await this.blogsRepository.findById(blogId);
    if (!blog) {
      return handleBadRequestResult("blog not found", "blogId");
    }
    await this.postRepository.create({
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
    const result = await this.postRepository.update(id, dto);
    if (!result) {
      return handleNotFoundResult("Post not found", "postId");
    }
    return handleSuccessResult();
  }

  async delete(id: string): Promise<Result> {
    const result = await this.postRepository.delete(id);
    if (!result) {
      return handleNotFoundResult("Post not found", "postId");
    }
    return handleSuccessResult();
  }
}
