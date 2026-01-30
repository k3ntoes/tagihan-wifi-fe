"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { registerAction } from "@/lib/actions/auth";
import { useServerMutation } from "@/lib/hooks/use-server-query";
import { type RegisterValues, registerSchema } from "@/lib/schemas/auth";

export function RegisterForm() {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<RegisterValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
			role: "USER",
		},
	});

	const mutation = useServerMutation({
		mutationFn: registerAction,
		successMessage: "Registrasi berhasil! Silakan login.",
		onSuccess: () => {
			router.push("/auth/login");
		},
	});

	const onSubmit = (data: RegisterValues) => {
		// Remove confirmPassword before sending if needed, but schema matching usually fine
		const { confirmPassword, ...payload } = data;
		mutation.mutate(payload);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="username" className="text-white">
					Username
				</Label>
				<Input
					id="username"
					type="text"
					placeholder="Pilih username"
					{...register("username")}
					className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
				/>
				{errors.username && (
					<p className="text-red-400 text-sm">{errors.username.message}</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="email" className="text-white">
					Email
				</Label>
				<Input
					id="email"
					type="email"
					placeholder="email@example.com"
					{...register("email")}
					className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
				/>
				{errors.email && (
					<p className="text-red-400 text-sm">{errors.email.message}</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="password" className="text-white">
					Password
				</Label>
				<Input
					id="password"
					type="password"
					placeholder="Minimal 6 karakter"
					{...register("password")}
					className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
				/>
				{errors.password && (
					<p className="text-red-400 text-sm">{errors.password.message}</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="confirmPassword" className="text-white">
					Konfirmasi Password
				</Label>
				<Input
					id="confirmPassword"
					type="password"
					placeholder="Ulangi password"
					{...register("confirmPassword")}
					className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
				/>
				{errors.confirmPassword && (
					<p className="text-red-400 text-sm">
						{errors.confirmPassword.message}
					</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="role" className="text-white">
					Role
				</Label>
				<Select
					value={watch("role")}
					onValueChange={(value: "ADMIN" | "USER") => setValue("role", value)}
				>
					<SelectTrigger className="bg-white/10 border-white/20 text-white">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="USER">USER</SelectItem>
						<SelectItem value="ADMIN">ADMIN</SelectItem>
					</SelectContent>
				</Select>
				{errors.role && (
					<p className="text-red-400 text-sm">{errors.role.message}</p>
				)}
			</div>

			<Button
				type="submit"
				className="w-full bg-white text-purple-600 hover:bg-gray-100 font-semibold"
				disabled={mutation.isPending}
			>
				{mutation.isPending ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Mendaftar...
					</>
				) : (
					"Daftar"
				)}
			</Button>

			<div className="text-center text-sm text-gray-200">
				Sudah punya akun?{" "}
				<Link
					href="/auth/login"
					className="text-white font-semibold hover:underline"
				>
					Login disini
				</Link>
			</div>
		</form>
	);
}
