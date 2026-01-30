import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PelangganForm } from "@/components/forms/pelanggan-form";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getPelangganById } from "@/lib/actions/pelanggan";

export default async function EditPelangganPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	// biome-ignore lint/suspicious/noExplicitAny: Simplified typing for legacy pattern
	let pelanggan: any;
	const id = (await params).id;

	try {
		pelanggan = await getPelangganById(id);
	} catch (_error) {
		notFound();
	}

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
					<CardTitle className="text-2xl text-white">Edit Pelanggan</CardTitle>
					<CardDescription className="text-slate-300">
						Perbarui data pelanggan {pelanggan.nama}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<PelangganForm
						mode="edit"
						pelangganId={pelanggan.id}
						initialData={{
							nama: pelanggan.nama,
							alamat: pelanggan.alamat || "",
							no_hp: pelanggan.no_hp || "",
							paket_id: pelanggan.paket?.id || "",
						}}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
