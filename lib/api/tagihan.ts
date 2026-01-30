import type { ApiSuccessMessage, PaginationResponse } from "@/types/api.types";
import type {
	Tagihan,
	TagihanQueryParams,
	TagihanRequest,
	TagihanSummaryResponse,
} from "@/types/tagihan.types";
import apiClient from "../api-client";

export const tagihanApi = {
	// Get all tagihan with pagination
	getAll: async (
		params: TagihanQueryParams,
	): Promise<PaginationResponse<Tagihan>> => {
		const response = await apiClient.get<PaginationResponse<Tagihan>>(
			"/tagihan",
			{ params },
		);
		return response.data;
	},

	// Get tagihan by ID
	getById: async (id: string): Promise<Tagihan> => {
		const response = await apiClient.get<Tagihan>(`/tagihan/${id}`);
		return response.data;
	},

	// Create new tagihan
	create: async (data: TagihanRequest): Promise<ApiSuccessMessage> => {
		const response = await apiClient.post<ApiSuccessMessage>("/tagihan", data);
		return response.data;
	},

	// Update tagihan
	update: async (
		id: string,
		data: TagihanRequest,
	): Promise<ApiSuccessMessage> => {
		const response = await apiClient.put<ApiSuccessMessage>(
			`/tagihan/${id}`,
			data,
		);
		return response.data;
	},

	// Delete tagihan
	delete: async (id: string): Promise<ApiSuccessMessage> => {
		const response = await apiClient.delete<ApiSuccessMessage>(
			`/tagihan/${id}`,
		);
		return response.data;
	},

	// Get summary by year
	getSummary: async (tahun: number): Promise<TagihanSummaryResponse> => {
		const response = await apiClient.get<TagihanSummaryResponse>(
			`/tagihan/summary/${tahun}`,
		);
		return response.data;
	},
};
