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
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );
  //   console.log(accessToken && "accessToken");

  const refreshToken = get(req, "headers.x-refresh");

  if (!accessToken) {
    return next();
  }

  const { decoded, expired } = verifyJwt(accessToken);

  // console.log("decoded", decoded);
  // console.log("expired", expired);

  if (decoded) {
    // @ts-ignore
    res.locals.user = decoded._doc;
    // return next();
  }

  if (!decoded && refreshToken) {
    const newAccessToken = await refreshAccessToken({ refreshToken });

    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);
    }

    const result = verifyJwt(newAccessToken);

    res.locals.user = result.decoded;

    // console.log(result);

    return next();
  }

  return next();
};

export default deserializeUser;
