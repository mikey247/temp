"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSessionHandler = exports.getUserSessionsHandler = exports.createSessionHandler = void 0;
const config_1 = __importDefault(require("config"));
const session_service_1 = require("../service/session.service");
const user_service_1 = require("../service/user.service");
const jwt_utils_1 = require("../utils/jwt.utils");
function createSessionHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // VALIDATE PASSWORD
        const user = yield (0, user_service_1.validatePassword)(req.body);
        if (!user) {
            return res.status(401).send("Invalid email or password");
        }
        //CREATE SESSION
        const session = yield (0, session_service_1.createSession)(user._id, req.get("user-agent") || "");
        // CREATE ACCESS TOKEN
        const accessToken = (0, jwt_utils_1.signJwt)(Object.assign(Object.assign({}, user), { session: session._id }), { expiresIn: config_1.default.get("accessTokenTtl") });
        // CREATE REFRESH TOKEN
        const refreshToken = (0, jwt_utils_1.signJwt)(Object.assign(Object.assign({}, user), { session: session._id }), { expiresIn: config_1.default.get("refreshTokenTtl") });
        // RETURN ACCESS AND REFRESH TOKENS
        return res.send({ accessToken, refreshToken });
    });
}
exports.createSessionHandler = createSessionHandler;
function getUserSessionsHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("getUserSessionHandler", res.locals.user);
        const userId = res.locals.user._id;
        // console.log("userId", userId);
        const sessions = yield (0, session_service_1.findSessions)({ user: userId, valid: true });
        return res.send(sessions);
    });
}
exports.getUserSessionsHandler = getUserSessionsHandler;
function deleteSessionHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const sessionId = res.locals.user.session;
        yield (0, session_service_1.updateSessions)({ _id: sessionId }, { valid: false });
        return res.send({
            accessToken: null,
            refreshToken: null,
        });
    });
}
exports.deleteSessionHandler = deleteSessionHandler;
