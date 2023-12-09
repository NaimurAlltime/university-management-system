import { z } from "zod";

const UserValidationScheme = z.object({
  password: z
    .string({ invalid_type_error: "Password must be a string" })
    .max(20, { message: "password can not be more then 20 character" })
    .optional(),
});

export const UserValidation = {
  UserValidationScheme,
};
