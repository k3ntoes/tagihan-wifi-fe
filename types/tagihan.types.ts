import { Paket } from './paket.types';

// Tagihan (Billing) Type
export interface Tagihan {
    id: string; // Encoded ID
    pelanggan: {
        id: string;
        nama: string;
    };
    paket: Paket;
    tahun: number;
    bulan: number;
    tanggal_bayar: string;
    created_at: string;
    updated_at: string;
}

// Create/Update Tagihan Request
export interface TagihanRequest {
    pelanggan_id: string; // Encoded ID
    paket_id: string; // Encoded ID
    tahun: number;
    bulan: number;
    tanggal_bayar: string; // YYYY-MM-DD format
}

// Query params for Tagihan list
export interface TagihanQueryParams {
    page?: number;
    size?: number;
    sort?: string;
    direction?: 'ASC' | 'DESC';
    tahun: number; // Required
    bulan: number; // Required
    pelanggan_id?: number; // Raw integer
    paket_id?: number; // Raw integer
}

// Tagihan Summary
export interface TagihanSummaryItem {
    bulan: number;
    total_tagihan: number;
    total_pendapatan: number;
}

export interface TagihanSummaryResponse {
    summary: TagihanSummaryItem[];
}
