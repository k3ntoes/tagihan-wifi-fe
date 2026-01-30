import { Plus } from "lucide-react";
import Link from "next/link";
import { PelangganListClient } from "@/components/pelanggan/pelanggan-list-client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default async function PelangganPage() {
	return (
		<div className="space-y-6">
			<Card className="glass-card border-slate-700/50">
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle className="text-2xl text-white">
							Manajemen Pelanggan
						</CardTitle>
						<CardDescription className="text-slate-300">
							Kelola data pelanggan WiFi
						</CardDescription>
					</div>
					<Link href="/pelanggan/new">
						<Button className="cursor-pointer gradient-primary text-white hover:opacity-90">
							<Plus className="mr-2 h-4 w-4" />
							Tambah Pelanggan
						</Button>
					</Link>
				</CardHeader>
				<CardContent>
					<PelangganListClient />
				</CardContent>
			</Card>
		</div>
	);
}
