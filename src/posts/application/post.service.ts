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
import { inject, injectable } from "inversify";
import {PostModel} from "../types/postMongoose";

@injectable()
export class PostsService {
  constructor(
    @inject(PostsRepository) private postRepository: PostsRepository,
    @inject(BlogsRepository) private blogsRepository: BlogsRepository,
  ) {}
  async create(dto: PostInputDto): Promise<Result<string>> {
    const foundBlog = await this.blogsRepository.findById(dto.blogId);
    if (!foundBlog) {
      return handleBadRequestResult("blog not found", "blogId");
    }
    const newPost = new PostModel();
    newPost.title = dto.title;
    newPost.shortDescription = dto.shortDescription;
    newPost.content = dto.content;
    newPost.blogId = foundBlog.id;
    newPost.blogName = foundBlog.name
    const newPostId = await this.postRepository.create(newPost);
    return handleSuccessResult(newPostId);
  }

  async createPostByBlogId(
    blogId: string,
    dto: PostByIdInputDto,
  ): Promise<Result<string>> {
    const blog = await this.blogsRepository.findById(blogId);
    if (!blog) {
      console.log("blog exist check in BLL");
      return handleBadRequestResult("blog not found", "blogId");
    }
    const createdPostsId: string = await this.postRepository.create({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: blogId,
      blogName: blog.name,
      createdAt: new Date(),
    });
    return handleSuccessResult(createdPostsId);
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
