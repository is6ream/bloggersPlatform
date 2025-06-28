import { Router } from "express";
type VideoOutputModel = {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
  };
};

type DBVideo = {
  _id: string;
  title: string;
  authorId: string;
  banObject: null | {
    isBanned: boolean;
    banReason: string;
  };
  isBanned: boolean;
};

type DBAuthor = {
  _id: string;
  firstName: string;
  lastName: string;
};

const videoQueryRepo = {
  getVideos(): VideoOutputModel[] {
    const dbVideos: DBVideo[] = [];
    const authors: DBAuthor[] = [];
    return dbVideos.map((dbVideo) => {
      const author = authors.find((a) => a._id === dbVideo.authorId);

      return this.mapToVideoOutputModel(dbVideo, author!);
    });
  },

  getVideoById(id: string): VideoOutputModel {
    const dbVideos: DBVideo = {
      _id: "3334",
      title: "sds",
      authorId: "3232",
    };
    const author: DBAuthor = {
      _id: "32",
      lastName: "da",
      firstName: "das",
    };

    return this.mapToVideoOutputModel(dbVideos, author);
  },

  mapToVideoOutputModel(dbVideo: DBVideo, dbAuthor: DBAuthor) {
    return {
      id: dbVideo._id,
      title: dbVideo.title,
      author: {
        id: dbAuthor!._id,
        name: dbAuthor.firstName + " " + dbAuthor.lastName,
      },
    };
  },

  getBannedVideos(id: string): BannedVideoOutputModel[] {
    const dbVideos: DBVideo[] = [];
    const authors: DBAuthor[] = [];

    return dbVideos.map((dbVideo) => {
      const dbAuthor = authors.find((a) => a._id === dbVideo.authorId);
      return {
        id: dbVideo._id,
        title: dbVideo.title,
        author: {
          id: dbAuthor!._id,
          name: dbAuthor?.firstName + " " + dbAuthor?.lastName,
        },
        banReason: dbVideo.banObject?.banReason,
      };
    });
  },
};

export type BannedVideoOutputModel = VideoOutputModel & {
  banReason: string;
};

import { Request, Response } from "express";

export const usersRouter = Router({});

usersRouter.post("/", async (req: Request, res: Response) => {
  const newProduct = await usersService.createUser(
    req.body.login,
    req.body.email,
    req.body.password,
  );

  res.status(201).send(newProduct);
});
