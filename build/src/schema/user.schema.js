"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({
            required_error: "Name is Required",
        }),
        password: (0, zod_1.string)({
            required_error: "Pasword is Required",
        }).min(6, "Password too short - should be at least 6 characters"),
        passwordConfirmation: (0, zod_1.string)({
            required_error: "password confirmation is Required",
        }),
        email: (0, zod_1.string)({
            required_error: "Email is required",
        }).email("Not a valid email"),
        //
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: "Passwords do not match",
        path: ["passwordConfirmation"],
    }),
});
