import { Request, Response } from "express";
import { postRepository } from "../repositories/postRepository";
import { PostType } from "../types/posts-types";
import { db } from "../../db/mongo.db";
import { HttpStatus } from "../../core/types";

function generateNumericId(length = 10) {
  const randomNumber = Math.floor(Math.random() * Math.pow(10, length));
  return randomNumber.toString().padStart(length, "0");
}

export function createPostHandler(req: Request, res: Response) {
  const foundBlog = db.blogs.find((blog) => blog.id === req.body.blogId);

  if (!foundBlog) {
    res.status(HttpStatus.NotFound).send("Blog not found");
    return;
  }
  const newPost: PostType = {
    id: generateNumericId(),
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: foundBlog.id,
    blogName: foundBlog.name,
  };

  postRepository.create(newPost);
  res.status(HttpStatus.Created).send(newPost);
}
