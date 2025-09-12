import express from "express";
import session from "express-session";
import { Request, Response } from "express";

const app = express();

app.use(
  session({
    secret: "super-secret-key", //ключ для подписи cookie
    resave: false, //не пересохранять сессию без изменений
    saveUninitialized: true, //сохранять даже пустые сессии
    cookie: { secure: false }, //true - только для https, для локалки пойдет false
  }),
);

app.get("/", (req: Request, res: Response) => {
  if (req.session.views) {
    const counter = req.session.views++;
    res.send(`Добро пожаловать снова, вы заходили ${counter} раз`);
  } else {
    req.session.views = 1;
    res.send("Привет! Это твой первый визит!");
  }
});

app.listen(3003, () => {
  console.log("Demo started at http://localhost:3000");
});
