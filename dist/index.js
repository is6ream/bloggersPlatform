"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setup_app_1 = require("./setup-app");
const PORT = process.env.PORT || 5001;
setup_app_1.app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}`);
});
