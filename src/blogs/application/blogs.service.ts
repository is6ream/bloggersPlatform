import { Result } from "../../core/result/result.type";
import { BlogInputModel, BlogInputDto } from "../types/blogs-types";
import { BlogsRepository } from "../infrastructure/blogs.repository";
import {
  handleNotFoundResult,
  handleSuccessResult,
} from "../../core/result/handleResult";
import { injectable, inject } from "inversify";

@injectable()
export class BlogsService {
  constructor(
    @inject(BlogsRepository) private blogsRepository: BlogsRepository,
  ) {}

  async create(dto: BlogInputModel): Promise<string> {
    const newBlog: BlogInputDto = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date(),
      isMembership: false,
    };
    return this.blogsRepository.create(newBlog);
  }

  async update(id: string, dto: BlogInputDto): Promise<Result> {
    const updateResult = await this.blogsRepository.update(id, dto);
    if (!updateResult) {
      return handleNotFoundResult("Blog not found", "blogId");
    }
    return handleSuccessResult();
  }

  async delete(id: string): Promise<Result> {
    const result = await this.blogsRepository.delete(id);
    if (!result) {
      return handleNotFoundResult("Blog not found", "blogId");
    } else {
      return handleSuccessResult();
    }
  }
}
