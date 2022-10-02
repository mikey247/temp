import { Express, NextFunction, Request, Response } from "express";
import { omit } from "lodash";

import logger from "../utils/logger";
import { createUser } from "../service/user.service";
import { CreateUserInput } from "../schema/user.schema";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    const user = await createUser(req.body);
    //@ts-ignore
    user.password = undefined;
    res.status(201).json(user);
  } catch (e: any) {
    logger.error(e);
    return res.status(409).send(e.message);
  }
}

export async function getCurrentUser(req: Request, res: Response) {
  return res.send(res.locals.user);
}
