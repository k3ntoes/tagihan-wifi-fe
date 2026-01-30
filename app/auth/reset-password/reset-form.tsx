"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api/auth";

export function ResetPasswordForm() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		token: "",
		newPassword: "",
		confirmPassword: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (formData.newPassword !== formData.confirmPassword) {
			toast.error("Password tidak cocok!");
			return;
		}

		if (formData.newPassword.length < 6) {
			toast.error("Password minimal 6 karakter!");
			return;
		}

		setIsLoading(true);

		try {
			await authApi.resetPassword({
				token: formData.token,
				new_password: formData.newPassword,
			});
			toast.success("Password berhasil direset! Silakan login.");
			router.push("/auth/login");
		} catch (error: any) {
			toast.error(
				error.response?.data?.detail ||
					"Gagal reset password. Token mungkin tidak valid.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="token" className="text-white">
					Token Reset
				</Label>
				<Input
					id="token"
					type="text"
					placeholder="Token dari email Anda"
					value={formData.token}
					onChange={(e) => setFormData({ ...formData, token: e.target.value })}
					required
					className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="newPassword" className="text-white">
					Password Baru
				</Label>
				<Input
					id="newPassword"
					type="password"
					placeholder="Minimal 6 karakter"
					value={formData.newPassword}
					onChange={(e) =>
						setFormData({ ...formData, newPassword: e.target.value })
					}
					required
					minLength={6}
					className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="confirmPassword" className="text-white">
					Konfirmasi Password
				</Label>
				<Input
					id="confirmPassword"
					type="password"
					placeholder="Ulangi password baru"
					value={formData.confirmPassword}
					onChange={(e) =>
						setFormData({ ...formData, confirmPassword: e.target.value })
					}
					required
					className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
				/>
			</div>

			<Button
				type="submit"
				className="w-full bg-white text-purple-600 hover:bg-gray-100 font-semibold"
				disabled={isLoading}
			>
				{isLoading ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Mereset...
					</>
				) : (
					"Reset Password"
				)}
			</Button>

			<div className="text-center">
				<Link
					href="/auth/login"
					className="text-gray-200 hover:text-white transition-colors inline-flex items-center text-sm"
				>
					<ArrowLeft className="w-4 h-4 mr-1" />
					Kembali ke login
				</Link>
			</div>
		</form>
	);
}
