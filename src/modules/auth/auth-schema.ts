import z from "zod";

const register = z.object({
  email: z.email(),
  phone: z.string().optional(),
});

const login = z.object({});

export const authSchema = {
  register,
  login,
};
