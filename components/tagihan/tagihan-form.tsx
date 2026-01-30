"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { getPakets } from "@/lib/actions/paket";
import { getPelanggans } from "@/lib/actions/pelanggan";
import { createTagihan, updateTagihan } from "@/lib/actions/tagihan";
import { useServerList, useServerMutation } from "@/lib/hooks/use-server-query";
import {
	type TagihanFormValues,
	tagihanFormSchema,
} from "@/lib/schemas/tagihan";
import type { Tagihan } from "@/types/tagihan.types";

interface TagihanFormProps {
	initialData?: Tagihan;
	isEdit?: boolean;
}

export function TagihanForm({ initialData, isEdit = false }: TagihanFormProps) {
	const router = useRouter();

	const form = useForm<TagihanFormValues>({
		resolver: zodResolver(tagihanFormSchema),
		// defaultValues: {
		//     pelanggan_id: initialData?.pelanggan.id || '',
		//     paket_id: initialData?.paket.id || '',
		//     tahun: initialData?.tahun || new Date().getFullYear(),
		//     bulan: initialData?.bulan || new Date().getMonth() + 1,
		//     tanggal_bayar: initialData?.tanggal_bayar || new Date().toISOString().split('T')[0],
		// },
	});

	// Fetch Lists
	const { data: pelanggansData, isLoading: isLoadingPelanggans } =
		useServerList({
			queryKey: ["pelanggans-list"],
			queryFn: () => getPelanggans({ size: 100 }), // Fetch enough for dropdown
		});

	const { data: paketsData, isLoading: isLoadingPakets } = useServerList({
		queryKey: ["pakets-list"],
		queryFn: () => getPakets({ size: 100 }),
	});

	const pelanggans = useMemo(
		() => pelanggansData?.content || [],
		[pelanggansData?.content],
	);
	const pakets = useMemo(
		() => paketsData?.content || [],
		[paketsData?.content],
	);

	// Mutation
	const mutation = useServerMutation({
		mutationFn: async (values: TagihanFormValues) => {
			if (isEdit && initialData) {
				return updateTagihan(initialData.id, values);
			}
			return createTagihan(values);
		},
		onSuccess: () => {
			toast.success(
				isEdit ? "Tagihan berhasil diperbarui" : "Tagihan berhasil dibuat",
			);
			router.push("/tagihan");
			router.refresh();
		},
	});

	const onSubmit = (values: TagihanFormValues) => {
		mutation.mutate(values);
	};

	// Auto-select paket when pelanggan changes
	const watchPelangganId = form.watch("pelanggan_id");
	useEffect(() => {
		if (!isEdit && watchPelangganId) {
			const selectedPelanggan = pelanggans.find(
				(p) => p.id === watchPelangganId,
			);
			if (selectedPelanggan?.paket) {
				form.setValue("paket_id", selectedPelanggan.paket.id);
			}
		}
	}, [watchPelangganId, pelanggans, form, isEdit]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Pelanggan */}
					<FormField
						control={form.control}
						name="pelanggan_id"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-white">Pelanggan</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
									disabled={isLoadingPelanggans}
								>
									<FormControl>
										<SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-white">
											<SelectValue
												placeholder={
													isLoadingPelanggans ? "Memuat..." : "Pilih Pelanggan"
												}
											/>
										</SelectTrigger>
									</FormControl>
									<SelectContent className="bg-slate-800 text-slate-300 border-slate-700">
										{pelanggans.map((pelanggan) => (
											<SelectItem key={pelanggan.id} value={pelanggan.id}>
												{pelanggan.nama}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Paket */}
					<FormField
						control={form.control}
						name="paket_id"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-white">Paket</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
									disabled={isLoadingPakets}
								>
									<FormControl>
										<SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-white">
											<SelectValue
												placeholder={
													isLoadingPakets ? "Memuat..." : "Pilih Paket"
												}
											/>
										</SelectTrigger>
									</FormControl>
									<SelectContent className="bg-slate-800 text-slate-300 border-slate-700">
										{pakets.map((paket) => (
											<SelectItem key={paket.id} value={paket.id}>
												{paket.nama} - {paket.kecepatan}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Tahun */}
					<FormField
						control={form.control}
						name="tahun"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-white">Tahun</FormLabel>
								<FormControl>
									<Input
										type="number"
										{...field}
										className="bg-slate-800/50 border-slate-700/50 text-white"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Bulan */}
					<FormField
						control={form.control}
						name="bulan"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-white">Bulan</FormLabel>
								<Select
									onValueChange={(val) => field.onChange(parseInt(val, 10))}
									defaultValue={field.value.toString()}
								>
									<FormControl>
										<SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-white">
											<SelectValue placeholder="Pilih Bulan" />
										</SelectTrigger>
									</FormControl>
									<SelectContent className="bg-slate-800 text-slate-300 border-slate-700">
										{MONTHS.map((m) => (
											<SelectItem key={m.value} value={m.value}>
												{m.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Tanggal Bayar */}
					<FormField
						control={form.control}
						name="tanggal_bayar"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-white">Tanggal Bayar</FormLabel>
								<FormControl>
									<Input
										type="date"
										{...field}
										className="bg-slate-800/50 border-slate-700/50 text-white"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="flex justify-end gap-3 pt-4">
					<Button
						type="button"
						variant="ghost"
						onClick={() => router.back()}
						className="text-slate-400 hover:text-white hover:bg-slate-800/50"
					>
						Batal
					</Button>
					<Button
						type="submit"
						disabled={mutation.isPending}
						className="gradient-primary text-white"
					>
						{mutation.isPending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Menyimpan...
							</>
						) : (
							<>
								<Save className="mr-2 h-4 w-4" />
								Simpan
							</>
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
