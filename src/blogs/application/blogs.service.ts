import { WithId } from "mongodb";
import { BlogInputDto, BlogType } from "../types/blogs-types";
import { blogsRepository } from "../repositories/blogs.repository";

export interface BlogQueryInput {}

export const blogService = {
  async findMany(
    queryDto: BlogQueryInput
  ): Promise<{ items: WithId<BlogType>[]; totalCount: number }> {
    return blogsRepository.findAll(queryDto);
  },

  async findByIdOrFail(id: string): Promise<WithId<BlogType | null>> {
    return blogsRepository.findById(id);
  },

  async create(dto: BlogInputDto): Promise<string> {
    const newBlog: BlogType = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };

    return blogsRepository.create(newBlog);
  },
};
