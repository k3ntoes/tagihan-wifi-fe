// Paket (Package) Type
export interface Paket {
	id: string; // Encoded ID
	nama: string;
	harga: number;
	kecepatan: string;
	created_at: string;
	updated_at: string;
}

// Create/Update Paket Request
export interface PaketRequest {
	nama: string;
	harga: number;
	kecepatan: string;
}

// Query params for Paket list
export interface PaketQueryParams {
	page?: number;
	size?: number;
	sort?: string;
	direction?: "ASC" | "DESC";
	nama?: string;
	kecepatan?: string;
}
