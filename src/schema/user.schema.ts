import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is Required",
    }),

    password: string({
      required_error: "Pasword is Required",
    }).min(6, "Password too short - should be at least 6 characters"),

    passwordConfirmation: string({
      required_error: "password confirmation is Required",
    }),

    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
    //
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  "body.passwordConfirmation"
>;
