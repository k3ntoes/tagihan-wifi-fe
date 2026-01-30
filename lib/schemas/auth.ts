import { z } from "zod";

export const loginSchema = z.object({
	username: z.string().min(1, "Username wajib diisi"),
	password: z.string().min(1, "Password wajib diisi"),
});

export const registerSchema = z
	.object({
		username: z.string().min(3, "Username minimal 3 karakter"),
		email: z.string().email("Email tidak valid"),
		password: z.string().min(6, "Password minimal 6 karakter"),
		confirmPassword: z
			.string()
			.min(6, "Konfirmasi Password minimal 6 karakter"),
		role: z.enum(["ADMIN", "USER"]),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Password tidak cocok",
		path: ["confirmPassword"],
	});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
