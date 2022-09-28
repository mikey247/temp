import { Express, Request, Response } from "express";
import validate from "./middleware/validateResource";
import {
  createSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
} from "./controller/session.controller";
import { createUserHandler } from "./controller/user.controller";
import {
  createProductHandler,
  getProductHandler,
  updateProductHandler,
  deleteProductHandler,
} from "./controller/product.controller";
import { createSessionSchema } from "./schema/session.schema";
import { createUserSchema } from "./schema/user.schema";
import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  updateProductSchema,
} from "./schema/product.schema";
import deserializeUser from "./middleware/deserializeUser";
import requireUser from "./middleware/requireUser";

function routes(app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.post("/api/user", validate(createUserSchema), createUserHandler);

  app.post(
    "/api/sessions",
    validate(createSessionSchema),
    createSessionHandler
  );

  app.use(deserializeUser);

  app.get("/api/sessions", requireUser, getUserSessionsHandler);

  app.delete("/api/sessions", requireUser, deleteSessionHandler);

  app.post(
    "/api/products",
    [requireUser, validate(createProductSchema)],
    createProductHandler
  );

  app.put(
    "/api/products/:productId",
    [requireUser, validate(updateProductSchema)],
    updateProductHandler
  );

  app.get(
    "/api/products/:productId",
    validate(getProductSchema),
    getProductHandler
  );

  app.delete(
    "/api/products/:productId",
    [requireUser, validate(deleteProductSchema)],
    deleteProductHandler
  );
}

export default routes;
