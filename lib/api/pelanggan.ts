import apiClient from '../api-client';
import { Pelanggan, PelangganRequest, PelangganQueryParams } from '@/types/pelanggan.types';
import { PaginationResponse, ApiSuccessMessage } from '@/types/api.types';

export const pelangganApi = {
    // Get all pelanggan with pagination
    getAll: async (params?: PelangganQueryParams): Promise<PaginationResponse<Pelanggan>> => {
        const response = await apiClient.get<PaginationResponse<Pelanggan>>('/pelanggan', { params });
        return response.data;
    },

    // Get pelanggan by ID
    getById: async (id: string): Promise<Pelanggan> => {
        const response = await apiClient.get<Pelanggan>(`/pelanggan/${id}`);
        return response.data;
    },

    // Create new pelanggan
    create: async (data: PelangganRequest): Promise<ApiSuccessMessage> => {
        const response = await apiClient.post<ApiSuccessMessage>('/pelanggan', data);
        return response.data;
    },

    // Update pelanggan
    update: async (id: string, data: PelangganRequest): Promise<ApiSuccessMessage> => {
        const response = await apiClient.put<ApiSuccessMessage>(`/pelanggan/${id}`, data);
        return response.data;
    },

    // Delete pelanggan
    delete: async (id: string): Promise<ApiSuccessMessage> => {
        const response = await apiClient.delete<ApiSuccessMessage>(`/pelanggan/${id}`);
        return response.data;
    },
};
