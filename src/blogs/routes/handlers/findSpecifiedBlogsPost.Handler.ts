import { Request, Response } from "express";
import { blogsRepository } from "../../repositories/blogs.repository";
import { HttpStatus } from "../../../core/http-statuses";
import { BlogType } from "../../types/blogs-types";
import { createErrorMessages } from "../../../core/error.utils";
import { blogsService } from "../../application/blogs.service";

export async function findPostForSpecifiedBlog(req: Request, res: Response) {
    try {
        const blog = await blogsService.findByIdOrFail(req.params.id)
    }
}
