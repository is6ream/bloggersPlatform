"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupApp = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const setupApp = (app) => {
  app.use(express_1.default.json());
  app.delete("/testing/all-data", (req, res) => {
    db_1.db.videos = [];
    res.status(201).send();
  });
  app.get("/videos/:id", (req, res) => {
    const video = db_1.db.videos.find((v) => v.id === +req.params.id);
    if (video === undefined) {
      res.status(404).send({ message: "Video not found" });
    }
    res.status(200).send(video);
  }),
    app.post("/videos", (req, res) => {
      const newVideo = {
        id: Math.floor(Date.now() + Math.random()),
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions: ["P144" /* availableResolutions.P144 */],
      };
      db_1.db.videos.push(newVideo);
      res.status(201).send(newVideo);
    });
  app.put("/videos/:id", (req, res) => {
    const findVideo = db_1.db.videos.find((v) => v.id === +req.params.id);
    if (findVideo === undefined) {
      res.status(404).send({ message: "Video not  found" });
      return;
    }
    findVideo.title = req.body.title || findVideo.title;
    findVideo.author = req.body.author || findVideo.author;
    findVideo.canBeDownloaded =
      req.body.canBeDownloaded || findVideo.canBeDownloaded;
    findVideo.minAgeRestriction =
      req.body.minAgeRestriction || findVideo.minAgeRestriction;
    findVideo.publicationDate =
      req.body.publicationDate || findVideo.publicationDate;
    findVideo.availableResolutions =
      req.body.availableResolutions || findVideo.availableResolutions;
    res.status(204).send();
  });
  app.delete("/videos/:id", (req, res) => {
    const id = +req.params.id;
    const findVideo = db_1.db.videos.find((v) => v.id === id);
    if (!findVideo) {
      res.status(404).send({ message: "Video is not found!" });
    }
    db_1.db.videos = db_1.db.videos.filter((v) => v.id !== id);
    res.status(204).send();
  });
};
exports.setupApp = setupApp;
