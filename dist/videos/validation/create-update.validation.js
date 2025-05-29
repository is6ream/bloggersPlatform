"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInputValidation = exports.updateInputValidation = void 0;
const resolutions_1 = require("../../core/resolutions");
const updateInputValidation = (video) => {
  const errors = {
    errorsMessages: [],
  };
  if (
    !video.title ||
    video.title.trim().length === 0 ||
    typeof video.title !== "string" ||
    video.title.length > 40
  ) {
    errors.errorsMessages.push({ message: "error!", field: "title" });
  }
  if (
    !video.author ||
    video.author.trim().length === 0 ||
    typeof video.author !== "string" ||
    video.author.length > 20
  ) {
    errors.errorsMessages.push({ message: "error!", field: "author" });
  }
  if (
    !Array.isArray(video.availableResolutions) ||
    video.availableResolutions.find((p) => !resolutions_1.RESOLUTIONS[p])
  ) {
    errors.errorsMessages.push({
      message: "error!",
      field: "availableResolutions",
    });
  }
  if (!video.canBeDownloaded || typeof video.canBeDownloaded !== "boolean") {
    errors.errorsMessages.push({ message: "error!", field: "canBeDownloaded" });
  }
  if (
    video.minAgeRescriction !== undefined &&
    (typeof video.minAgeRescriction !== "number" ||
      video.minAgeRescriction < 1 ||
      video.minAgeRescriction > 18)
  ) {
    errors.errorsMessages.push({
      message: "error!",
      field: "minAgeRestriction",
    });
  }
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  if (
    !video.publicationDate ||
    typeof video.publicationDate !== "string" ||
    !video.publicationDate.match(iso8601Regex)
  ) {
    errors.errorsMessages.push({ message: "error!", field: "publicationDate" });
  }
  return errors;
};
exports.updateInputValidation = updateInputValidation;
const createInputValidation = (video) => {
  const errors = {
    errorsMessages: [],
  };
  if (
    !video.title ||
    video.title.trim().length === 0 ||
    typeof video.title !== "string" ||
    video.title.length > 40
  ) {
    errors.errorsMessages.push({ message: "error!", field: "title" });
  }
  if (
    !video.author ||
    video.author.trim().length === 0 ||
    typeof video.author !== "string" ||
    video.author.length > 20
  ) {
    errors.errorsMessages.push({ message: "error!", field: "author" });
  }
  if (
    !Array.isArray(video.availableResolutions) ||
    video.availableResolutions.find((p) => !resolutions_1.RESOLUTIONS[p])
  ) {
    errors.errorsMessages.push({
      message: "error",
      field: "availableResolutions",
    });
  }
  return errors;
};
exports.createInputValidation = createInputValidation;
