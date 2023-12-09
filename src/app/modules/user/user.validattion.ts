import { z } from "zod";

const UserValidationScheme = z.object({
  id: z.string(),
  password: z
    .string()
    .max(20, { message: "password can not be more then 20 character" }),
  needsPasswordChange: z.boolean().optional().default(true),
  role: z.enum(["student", "faculty", "admin"]),
  status: z.enum(["in-progress", "blocked"]),
  isDeleted: z.boolean().optional().default(false),
});

export const UserValidation = {
  UserValidationScheme,
};
