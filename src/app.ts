import express from "express";
import config from "config";
import connect from "./utils/connect";
import log from "./utils/logger";
import routes from "./routes";

import createServer from "./utils/server";

const port = config.get<number>("port");

export const app = express();
// const app = createServer();

app.use(express.json());

app.listen(port, async () => {
  log.info(`App running on port ${port}`);
  await connect();
  routes(app);
});
