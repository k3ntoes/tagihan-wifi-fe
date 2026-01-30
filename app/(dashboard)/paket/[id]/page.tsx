import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PaketForm } from "@/components/forms/paket-form";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getPaketById } from "@/lib/actions/paket";

export default async function EditPaketPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	// biome-ignore lint/suspicious/noExplicitAny: Simplified typing for legacy pattern
	let paket: any;
	const id = (await params).id;

	try {
		paket = await getPaketById(id);
	} catch (_error) {
		notFound();
	}

	return (
		<div className="max-w-2xl">
			<div className="mb-6">
				<Link href="/paket">
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
					<CardTitle className="text-2xl text-white">Edit Paket WiFi</CardTitle>
					<CardDescription className="text-slate-300">
						Perbarui informasi paket {paket.nama}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<PaketForm
						mode="edit"
						paketId={paket.id}
						initialData={{
							nama: paket.nama,
							kecepatan: paket.kecepatan,
							harga: paket.harga,
						}}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
