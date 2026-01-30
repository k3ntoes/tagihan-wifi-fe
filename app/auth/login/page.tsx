import { Wifi } from "lucide-react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/forms/login-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
	title: "Login - Tagihan WiFi",
	description: "Masuk ke sistem manajemen tagihan WiFi",
};

export default function LoginPage() {
	return (
		<div className="min-h-screen flex items-center justify-center p-4 gradient-primary">
			<div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />

			<Card className="w-full max-w-md glass-card border-white/20 animate-scale-in relative z-10">
				<CardHeader className="space-y-3 text-center">
					<div className="mx-auto w-16 h-16 rounded-full gradient-secondary flex items-center justify-center mb-2">
						<Wifi className="w-8 h-8 text-white" />
					</div>
					<CardTitle className="text-3xl font-bold text-white">
						Tagihan WiFi
					</CardTitle>
					<CardDescription className="text-gray-200">
						Masuk ke sistem manajemen tagihan WiFi
					</CardDescription>
				</CardHeader>
				<CardContent>
					<LoginForm />
				</CardContent>
			</Card>
		</div>
	);
}
