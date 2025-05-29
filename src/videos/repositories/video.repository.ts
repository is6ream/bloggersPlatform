import { VideoType } from "../../core/video-types";
import { db } from "../../db";
import { VideoUpdateInputDto } from "../validation/validation-types";

export const videoRepository = {
  findAll(): VideoType[] {
    return db.videos;
  },

  findById(id: number): VideoType | null {
    return db.videos.find((v) => v.id === id) ?? null;
  },

  create(newVideo: VideoType): VideoType {
    db.videos.push(newVideo);
    return newVideo;
  },

  update(id: number, dto: VideoUpdateInputDto): void {
    const video = db.videos.find((v) => v.id === id);

    if (!video) {
      throw new Error("Video not exist");
    }
    video.title = dto.title;
    video.author = dto.author;
    video.availableResolutions = dto.availableResolutions;
    video.canBeDownloaded = dto.canBeDownloaded;
    video.minAgeRestriction = dto.minAgeRescriction;
    video.publicationDate = dto.publicationDate;
    return;
  },

  delete(id: number): void {
    const index = db.videos.findIndex((v) => v.id === id);

    if (index === -1) {
      throw new Error("Video not exist");
    }

    db.videos.splice(index, 1);
    return;
  },
};
