import { BlogInputModel, BlogInputDto } from "../types/blogs-types";
import { blogsRepository } from "../repositories/blogs.repository";

export const blogsService = {
  async create(dto: BlogInputModel): Promise<string> {
    const newBlog: BlogInputDto = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date(),
      isMembership: false,
    };

    return blogsRepository.create(newBlog);
  },

  async update(id: string, dto: BlogInputDto): Promise<void> {
    blogsRepository.update(id, dto);
    return;
  },

  async delete(id: string): Promise<boolean> {
    return blogsRepository.delete(id);
  },
};
