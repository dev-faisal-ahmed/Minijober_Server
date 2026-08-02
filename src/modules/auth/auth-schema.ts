import z from "zod";

const register = z.object({
  name: z.string("name_is_required"),
  email: z.email("invalid_email"),
  password: z.string({error:"password_is_required"}).nonempty("password_is_required"),
});

const login = z.object({
  email: z.email("invalid_email"),
  password: z.string("password_is_required").nonempty("password_is_required"),
});

export const authSchema = {
  register,
  login,
};

export type TRegister = z.infer<typeof register>;
export type TLogin = z.infer<typeof login>;
