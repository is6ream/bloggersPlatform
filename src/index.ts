import express from "express";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { videosRouter } from "./videos/routes";
import { app } from "./app";

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}`);
});
