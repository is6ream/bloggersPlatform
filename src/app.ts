import express from "express";
import cors from "cors"
import { videosRouter } from "./videos/routes";

export const app = express();
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    res.status(200).send('Hello world!')
})
app.use('/hometask_01/api/videos/', videosRouter)