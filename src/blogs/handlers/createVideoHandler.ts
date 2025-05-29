import { error } from 'console';
import { Request, Response } from "express";
import { createInputValidation } from "../validation/create-update.validation";
import { blogsRepository, videoRepository } from "../repositories/video.repository";


export function createBlogHandler(req: Request, res: Response){
  const errors = createInputValidation(req.body);

  if(errors.errorsMessages.length){
    res.status(400).json(errors)
    return
  }

  let newBlog = req.body;
  blogsRepository.create(newBlog);
  res.status(201).send(newBlog);
}