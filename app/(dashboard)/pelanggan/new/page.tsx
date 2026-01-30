import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PelangganForm } from "@/components/forms/pelanggan-form";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function NewPelangganPage() {
	return (
		<div className="max-w-2xl">
			<div className="mb-6">
				<Link href="/pelanggan">
					<Button
						variant="ghost"
						className="cursor-pointer text-slate-300 hover:text-white hover:bg-slate-700/50"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Kembali
					</Button>
				</Link>
			</div>

			<Card className="glass-card border-slate-700/50">
				<CardHeader>
					<CardTitle className="text-2xl text-white">
						Tambah Pelanggan
					</CardTitle>
					<CardDescription className="text-slate-300">
						Input data pelanggan baru
					</CardDescription>
				</CardHeader>
				<CardContent>
					<PelangganForm mode="create" />
				</CardContent>
			</Card>
		</div>
	);
}
