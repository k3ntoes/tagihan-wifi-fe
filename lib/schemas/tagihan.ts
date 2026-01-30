import { z } from "zod";
import type { Paket } from "@/types/paket.types";
import type { Pelanggan } from "@/types/pelanggan.types";

export interface Tagihan {
	id: string;
	pelanggan: Pelanggan;
	paket: Paket;
	tahun: number;
	bulan: number;
	tanggal_bayar: string;
	created_at: string;
	updated_at: string;
}
export const tagihanFormSchema = z.object({
	pelanggan_id: z.string().min(1, "Pelanggan harus dipilih"),
	paket_id: z.string().min(1, "Paket harus dipilih"),
	tahun: z.coerce
		.number()
		.min(2000, "Tahun tidak valid")
		.max(new Date().getFullYear() + 1, "Tahun tidak valid"),
	bulan: z.coerce
		.number()
		.min(1, "Bulan tidak valid")
		.max(12, "Bulan tidak valid"),
	tanggal_bayar: z.string().min(1, "Tanggal bayar harus diisi"),
});

export type TagihanFormValues = z.infer<typeof tagihanFormSchema>;
