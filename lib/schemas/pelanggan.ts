import { z } from "zod";

export const pelangganFormSchema = z.object({
	nama: z
		.string()
		.min(3, "Nama pelanggan minimal 3 karakter")
		.max(100, "Nama pelanggan maksimal 100 karakter"),
	alamat: z
		.string()
		.min(5, "Alamat minimal 5 karakter")
		.max(255, "Alamat maksimal 255 karakter"),
	no_hp: z
		.string()
		.min(10, "Nomor HP minimal 10 karakter")
		.max(15, "Nomor HP maksimal 15 karakter")
		.regex(
			/^(\+62|62|0)8[1-9][0-9]{6,9}$/,
			"Format nomor HP tidak valid (contoh: 08123456789)",
		),
	paket_id: z.string().min(1, "Paket wajib dipilih"),
});

export type PelangganFormValues = z.infer<typeof pelangganFormSchema>;
