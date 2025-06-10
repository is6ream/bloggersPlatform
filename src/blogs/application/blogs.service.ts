import { WithId } from "mongodb";
import { BlogType } from "../types/blogs-types";
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
};
