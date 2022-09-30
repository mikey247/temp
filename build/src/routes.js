"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validateResource_1 = __importDefault(require("./middleware/validateResource"));
const session_controller_1 = require("./controller/session.controller");
const user_controller_1 = require("./controller/user.controller");
const product_controller_1 = require("./controller/product.controller");
const session_schema_1 = require("./schema/session.schema");
const user_schema_1 = require("./schema/user.schema");
const product_schema_1 = require("./schema/product.schema");
const deserializeUser_1 = __importDefault(require("./middleware/deserializeUser"));
const requireUser_1 = __importDefault(require("./middleware/requireUser"));
function routes(app) {
    app.get("/healthcheck", (req, res) => {
        res.sendStatus(200);
    });
    app.post("/api/user", (0, validateResource_1.default)(user_schema_1.createUserSchema), user_controller_1.createUserHandler);
    app.post("/api/sessions", (0, validateResource_1.default)(session_schema_1.createSessionSchema), session_controller_1.createSessionHandler);
    app.use(deserializeUser_1.default);
    app.get("/api/sessions", requireUser_1.default, session_controller_1.getUserSessionsHandler);
    app.delete("/api/sessions", requireUser_1.default, session_controller_1.deleteSessionHandler);
    app.post("/api/products", [requireUser_1.default, (0, validateResource_1.default)(product_schema_1.createProductSchema)], product_controller_1.createProductHandler);
    app.put("/api/products/:productId", [requireUser_1.default, (0, validateResource_1.default)(product_schema_1.updateProductSchema)], product_controller_1.updateProductHandler);
    app.get("/api/products/:productId", (0, validateResource_1.default)(product_schema_1.getProductSchema), product_controller_1.getProductHandler);
    app.delete("/api/products/:productId", [requireUser_1.default, (0, validateResource_1.default)(product_schema_1.deleteProductSchema)], product_controller_1.deleteProductHandler);
}
exports.default = routes;
