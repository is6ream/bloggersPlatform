import { Request, Response } from "express";
import { postRepository } from "../repositories/postRepository";
import { PostType } from "../types/posts-types";
import { HttpStatus } from "../../core/types";
import { blogCollection } from "../../db/mongo.db";

function generateNumericId(length = 10) {
  const randomNumber = Math.floor(Math.random() * Math.pow(10, length));
  return randomNumber.toString().padStart(length, "0");
}

export function createPostHandler(req: Request, res: Response) {
  const foundBlog = blogCollection.findOne({ _id: req.body.id });

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
    createdAt: req.body.createdAt,
  };

  postRepository.create(newPost);
  res.status(HttpStatus.Created).send(newPost);
}
