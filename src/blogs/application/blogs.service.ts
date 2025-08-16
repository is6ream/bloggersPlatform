import { Result } from "./../../core/result/result.type";
import { BlogInputModel, BlogInputDto } from "../types/blogs-types";
import { blogsRepository } from "../repositories/blogs.repository";
import { ResultStatus } from "../../core/result/resultCode";

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

  async delete(id: string): Promise<Result> {
    const result = await blogsRepository.delete(id);
    if (!result) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "Post not found",
        extensions: [{ field: null, message: "Blog not found" }],
      };
    } else {
      return {
        status: ResultStatus.Success,
        extensions: [],
      };
    }
  },
};
