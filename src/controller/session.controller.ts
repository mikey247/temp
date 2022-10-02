import {
  CookieOptions,
  Express,
  NextFunction,
  Request,
  Response,
} from "express";
import config from "config";
import {
  createSession,
  findSessions,
  refreshAccessToken,
  updateSessions,
} from "../service/session.service";
import {
  findAndUpdateUser,
  getGoogleOAuthTokens,
  getGoogleUser,
  validatePassword,
} from "../service/user.service";
import { signJwt } from "../utils/jwt.utils";
import log from "../utils/logger";
import jwt from "jsonwebtoken";
import axios from "axios";

const accessTokenOptions: CookieOptions = {
  maxAge: 900000, //15min
  httpOnly: true,
  domain: "localhost",
  path: "/",
  sameSite: "strict",
  secure: false,
};

const refreshTokenOptions: CookieOptions = {
  maxAge: 3.154e10, //15min
  httpOnly: true,
  domain: "localhost",
  path: "/",
  sameSite: "strict",
  secure: false,
};

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

  res.cookie("accessToken", accessToken, accessTokenOptions);

  res.cookie("refreshToken", refreshToken, refreshTokenOptions);

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

export async function googleOauthHandler(req: Request, res: Response) {
  //get the code from request query
  const code = req.query.code;
  try {
    // get the id and access token with the code
    // @ts-ignore
    const { id_token, access_token } = await getGoogleOAuthTokens({ code });
    console.log({ id_token, access_token });

    // get users with token
    const googleUser = await getGoogleUser({ id_token, access_token });
    console.log(googleUser);

    // jwt.decode(id_token);

    //in case of an unverified emai
    if (!googleUser.verified_email) {
      return res.status(403).send("Google account is not verified");
    }

    // find user
    const user = await findAndUpdateUser(
      {
        email: googleUser.email,
      },
      {
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
      },
      {
        upsert: true,
        new: true,
      }
    );
    console.log(googleUser);

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

    res.cookie("accessToken", accessToken, accessTokenOptions);

    res.cookie("refreshToken", refreshToken, refreshTokenOptions);

    // redirect back to client
    res.redirect("http://localhost:3000");
  } catch (error: any) {
    log.error(error, "Failed to authorize");
    return res.redirect("http://localhost:3000/oauth/error");
  }
}
