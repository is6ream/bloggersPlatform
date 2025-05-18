import express, { Express } from "express"
import { newVideo } from "./db";

export const setupApp = (app: Express) => {
    app.use(express.json());

    app.get('/', (req, res) => {
        res.status(200).send("Hello world")
    })

    app.get('/video', (req, res) => {
        res.send(newVideo).status(200)
    })

    return app;
}

