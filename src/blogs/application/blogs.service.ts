import { Result } from "../../core/result/result.type";
import { BlogInputModel, BlogInputDto } from "../types/blogs-types";
import { BlogsRepository } from "../infrastructure/blogs.repository";
import {
  handleNotFoundResult,
  handleSuccessResult,
} from "../../core/result/handleResult";
import { injectable, inject } from "inversify";
import { BlogDocument, BlogModel } from "../domain/blogDomainModel";

@injectable()
export class BlogsService {
  constructor(
    @inject(BlogsRepository) private blogsRepository: BlogsRepository,
  ) {}

  async create(dto: BlogInputModel): Promise<string> {
    const blogInstance = new BlogModel();
    //создаем инстанс от модели блога из mongoose и присваиваем ей поля из dto, остальные поля стоят по дефолту
    blogInstance.name = dto.name;
    blogInstance.description = dto.description;
    blogInstance.websiteUrl = dto.websiteUrl;

    return this.blogsRepository.save(blogInstance);
  }

  async update(id: string, dto: BlogInputDto): Promise<Result> {
    const blog = await BlogModel.findById(id);
    if (!blog) {
      return handleNotFoundResult("Blog not found", "blogId");
    }
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;

    await this.blogsRepository.update(blog);
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
