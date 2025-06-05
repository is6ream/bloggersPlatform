import { Request, Response } from "express";
import { blogsRepository } from "../repositories/blogs.repository";
import { HttpStatus } from "../../core/types";

export async function getAllBlogsHandler(req: Request, res: Response) {
  try {
    const blogs = await blogsRepository.findAll();
    res.status(HttpStatus.Ok).json(blogs);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
