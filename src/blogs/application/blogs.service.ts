import { WithId } from "mongodb";
import { BlogInputDto, BlogType, BlogViewModel } from "../types/blogs-types";
import { blogsRepository } from "../repositories/blogs.repository";
import { BlogQueryInput } from "../routes/input/blog-query.input";
import { blogQueryRepository } from "../repositories/blogs.query.repository";

export const blogsService = {
  async findMany(
    queryDto: BlogQueryInput,
  ): Promise<{ items: WithId<BlogType>[]; totalCount: number }> {
    return blogQueryRepository.findAll(queryDto);
  },

  async findByIdOrFail(id: string): Promise<BlogViewModel | null> {
    return blogQueryRepository.findById(id);
  },

  async create(dto: BlogInputDto): Promise<BlogViewModel> {
    const newBlog: BlogType = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };

    return blogsRepository.create(newBlog);
  },

  async update(id: string, dto: BlogInputDto): Promise<void> {
    blogsRepository.update(id, dto);
    return;
  },

  async delete(id: string): Promise<void> {
    blogsRepository.delete(id);
    return;
  },
};
