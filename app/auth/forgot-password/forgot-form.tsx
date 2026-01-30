"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api/auth";

export function ForgotPasswordForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [resetToken, setResetToken] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await authApi.forgotPassword({ email });
			setResetToken(response.reset_token || "");
			toast.success(response.message || "Token reset telah dikirim!");
		} catch (error: any) {
			toast.error(
				error.response?.data?.detail || "Gagal mengirim token reset.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="email" className="text-white">
					Email
				</Label>
				<Input
					id="email"
					type="email"
					placeholder="email@example.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
				/>
			</div>

			{resetToken && (
				<div className="p-4 bg-green-500/20 border border-green-500/40 rounded-lg">
					<p className="text-sm text-white mb-2">Token Reset Anda:</p>
					<code className="text-white font-mono text-sm break-all">
						{resetToken}
					</code>
					<p className="text-xs text-gray-200 mt-2">
						Gunakan token ini di halaman reset password
					</p>
				</div>
			)}

			<Button
				type="submit"
				className="w-full bg-white text-purple-600 hover:bg-gray-100 font-semibold"
				disabled={isLoading}
			>
				{isLoading ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Mengirim...
					</>
				) : (
					"Kirim Token Reset"
				)}
			</Button>

			<div className="flex items-center justify-between text-sm">
				<Link
					href="/auth/login"
					className="text-gray-200 hover:text-white transition-colors inline-flex items-center"
				>
					<ArrowLeft className="w-4 h-4 mr-1" />
					Kembali ke login
				</Link>
				{resetToken && (
					<Link
						href="/auth/reset-password"
						className="text-white font-semibold hover:underline"
					>
						Reset Password →
					</Link>
				)}
			</div>
		</form>
	);
}
