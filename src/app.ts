import express from "express";
import config from "config";
import connect from "./utils/connect";
import log from "./utils/logger";
import routes from "./routes";
import cors from "cors";
import cookieParser from "cookie-parser";

import createServer from "./utils/server";

const port = config.get<number>("port");

export const app = express();
// const app = createServer();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);

app.listen(port, async () => {
  log.info(`App running on port ${port}`);
  await connect();
  routes(app);
});
