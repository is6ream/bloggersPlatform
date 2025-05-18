import express from "express"
import { setupApp } from "./setup-app"
import { Request, Response } from "express";
import dotenv from "dotenv"


dotenv.config();
const app = express();
setupApp(app);

const PORT = process.env.PORT || 5001;

app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Hello world!')
})

app.listen(PORT, () => {
    console.log(`Example app listening on port: ${PORT}`)
})