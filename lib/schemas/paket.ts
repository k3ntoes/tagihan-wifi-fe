import { z } from 'zod';

export const paketFormSchema = z.object({
    nama: z
        .string()
        .min(3, 'Nama paket minimal 3 karakter')
        .max(100, 'Nama paket maksimal 100 karakter'),
    kecepatan: z
        .string()
        .min(1, 'Kecepatan wajib diisi')
        .max(50, 'Kecepatan maksimal 50 karakter'),
    harga: z
        .number()
        .positive('Harga harus lebih dari 0')
        .int('Harga harus berupa bilangan bulat'),
});

export type PaketFormValues = z.infer<typeof paketFormSchema>;
