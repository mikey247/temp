//
import { get } from "lodash";
import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwt.utils";
import { refreshAccessToken } from "../service/session.service";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken =
    get(req, "cookies.accessToken") ||
    get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

  // console.log(accessToken && "accessToken");
  // console.log("accessToken", accessToken, "accessToken");

  const refreshToken =
    get(req, "cookies.refreshToken") || get(req, "headers.x-refresh");

  if (!accessToken) {
    return next();
  }

  const { decoded, expired } = verifyJwt(accessToken);

  // console.log("decoded", decoded);
  // console.log("expired", expired);

  if (decoded) {
    // @ts-ignore
    res.locals.user = decoded._doc;
    // res.locals.user = decoded;
    // return next();
  }

  if (!decoded && refreshToken) {
    const newAccessToken = await refreshAccessToken({ refreshToken });

    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);
      res.cookie("accessToken", accessToken, {
        maxAge: 900000, //15min
        httpOnly: true,
        domain: "localhost",
        path: "/",
        sameSite: "strict",
        secure: false,
      });
    }

    const result = verifyJwt(newAccessToken);

    res.locals.user = result.decoded;

    // console.log(result);

    return next();
  }

  return next();
};

export default deserializeUser;
