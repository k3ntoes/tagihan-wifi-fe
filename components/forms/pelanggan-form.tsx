"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { PaketSelect } from "@/components/forms/paket-select";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createPelanggan, updatePelanggan } from "@/lib/actions/pelanggan";
import { useServerMutation } from "@/lib/hooks/use-server-query";
import {
	type PelangganFormValues,
	pelangganFormSchema,
} from "@/lib/schemas/pelanggan";

interface PelangganFormProps {
	initialData?: PelangganFormValues;
	pelangganId?: string; // Encoded ID
	mode: "create" | "edit";
}

export function PelangganForm({
	initialData,
	pelangganId,
	mode,
}: PelangganFormProps) {
	const router = useRouter();

	const form = useForm<PelangganFormValues>({
		resolver: zodResolver(pelangganFormSchema),
		defaultValues: {
			nama: "",
			alamat: "",
			no_hp: "",
			paket_id: undefined,
			...initialData,
		},
	});

	// Reset form if initialData changes (useful for async loading)
	useEffect(() => {
		if (initialData) {
			form.reset(initialData);
		}
	}, [initialData, form]);

	const mutation = useServerMutation({
		mutationFn: async (data: PelangganFormValues) => {
			if (mode === "create") {
				return createPelanggan(data);
			} else if (pelangganId) {
				return updatePelanggan(pelangganId, data);
			}
			throw new Error("Invalid operation");
		},
		invalidateKeys: [["pelanggans"]],
		successMessage: `Pelanggan berhasil ${mode === "create" ? "ditambahkan" : "diperbarui"}`,
		onSuccess: () => {
			router.push("/pelanggan");
		},
	});

	const onSubmit = (data: PelangganFormValues) => {
		mutation.mutate(data);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="nama"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-white">Nama Pelanggan</FormLabel>
							<FormControl>
								<Input
									placeholder="Nama Lengkap"
									{...field}
									className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-400 focus:border-blue-500"
								/>
							</FormControl>
							<FormMessage className="text-red-400" />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="no_hp"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-white">Nomor HP</FormLabel>
							<FormControl>
								<Input
									placeholder="Contoh: 08123456789"
									{...field}
									className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-400 focus:border-blue-500"
								/>
							</FormControl>
							<FormMessage className="text-red-400" />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="alamat"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-white">Alamat</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Alamat Lengkap"
									{...field}
									className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-400 focus:border-blue-500 min-h-[100px]"
								/>
							</FormControl>
							<FormMessage className="text-red-400" />
						</FormItem>
					)}
				/>

				<PaketSelect control={form.control} name="paket_id" />

				<div className="flex gap-3 pt-4">
					<Button
						type="submit"
						disabled={mutation.isPending}
						className="cursor-pointer flex-1 gradient-primary text-white hover:opacity-90"
					>
						{mutation.isPending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Menyimpan...
							</>
						) : (
							<>
								<Save className="mr-2 h-4 w-4" />
								{mode === "create" ? "Simpan Pelanggan" : "Perbarui Pelanggan"}
							</>
						)}
					</Button>
					<Link href="/pelanggan" className="cursor-pointer flex-1">
						<Button
							type="button"
							variant="outline"
							className="cursor-pointer w-full bg-slate-800/50 border-slate-700/50 text-white hover:bg-slate-700/50"
						>
							Batal
						</Button>
					</Link>
				</div>
			</form>
		</Form>
	);
}
