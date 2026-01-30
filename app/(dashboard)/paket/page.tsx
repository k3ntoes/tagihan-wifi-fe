import { Plus } from "lucide-react";
import Link from "next/link";
import { PaketListClient } from "@/components/paket/paket-list-client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default async function PaketPage() {
	return (
		<div className="space-y-6">
			<Card className="glass-card border-slate-700/50">
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle className="text-2xl text-white">
							Manajemen Paket WiFi
						</CardTitle>
						<CardDescription className="text-slate-300">
							Kelola semua paket WiFi yang tersedia
						</CardDescription>
					</div>
					<Link href="/paket/new">
						<Button className="cursor-pointer gradient-primary text-white hover:opacity-90">
							<Plus className="mr-2 h-4 w-4" />
							Tambah Paket
						</Button>
					</Link>
				</CardHeader>
				<CardContent>
					<PaketListClient />
				</CardContent>
			</Card>
		</div>
	);
}
