import { app } from "./setup-app";

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}`);
});
