import type { Paket } from "./paket.types";

// Pelanggan (Customer) Type
export interface Pelanggan {
	id: string; // Encoded ID
	nama: string;
	alamat?: string;
	no_hp?: string;
	paket: Paket;
	created_at: string;
	updated_at: string;
}

// Create/Update Pelanggan Request
export interface PelangganRequest {
	nama: string;
	alamat: string;
	no_hp: string;
	paket_id: string; // Encoded ID
}

// Query params for Pelanggan list
export interface PelangganQueryParams {
	page?: number;
	size?: number;
	sort?: string;
	direction?: "ASC" | "DESC";
	nama?: string;
	paket_id?: string; // Encoded string // Raw integer
}
