import SessionModel, { SessionDocument } from "../models/session.model";
import { DocumentDefinition, FilterQuery, UpdateQuery } from "mongoose";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import { get } from "lodash";
import { findUser } from "./user.service";
import config from "config";

export async function createSession(userId: string, userAgent: any) {
  const session = await SessionModel.create({
    user: userId,
    userAgent,
  });
  return session.toJSON();
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
  return SessionModel.find(query).lean();
}

export async function updateSessions(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) {
  return SessionModel.updateOne(query, update);
}

export async function refreshAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  // console.log("refressssssssssssh");

  const { decoded } = verifyJwt(refreshToken);
  // console.log(decoded, "refresh-token decoded");

  if (!decoded) return false;
  const session = await SessionModel.findById(get(decoded, "session"));

  if (!session || !session.valid) return false;

  const user = await findUser({ _id: session.user });

  if (!user) return false;

  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get("accessTokenTtl") }
  );

  return accessToken;
}
