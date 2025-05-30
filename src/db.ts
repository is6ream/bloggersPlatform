import { RESOLUTIONS } from "./core/resolutions";
import { DBType } from "./core/blogs-types";
export const db: DBType = {
  videos: [],
};

const dbEntity = {
  id: 0,
  title: "t1",
  author: "a1",
  canBeDownloaded: true,
  minAgeRestriction: null,
  createdAt: new Date().toISOString(),
  publicationDate: new Date().toISOString(),
  availableResolutions: [RESOLUTIONS.P1440],
};
