import { Express, NextFunction, Request, Response } from "express";
import config from "config";
import {
  createSession,
  findSessions,
  refreshAccessToken,
  updateSessions,
} from "../service/session.service";
import { validatePassword } from "../service/user.service";
import { signJwt } from "../utils/jwt.utils";
import { identity } from "lodash";

export async function createSessionHandler(req: Request, res: Response) {
  // VALIDATE PASSWORD
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send("Invalid email or password");
  }
  //CREATE SESSION
  const session = await createSession(user._id, req.get("user-agent") || "");

  // CREATE ACCESS TOKEN
  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get("accessTokenTtl") }
  );
  // CREATE REFRESH TOKEN
  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get("refreshTokenTtl") }
  );
  // RETURN ACCESS AND REFRESH TOKENS

  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  console.log("getUserSessionHandler", res.locals.user);

  const userId = res.locals.user._id;
  // console.log("userId", userId);

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;

  await updateSessions({ _id: sessionId }, { valid: false });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}
