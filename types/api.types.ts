// Pagination Response Type
export interface PaginationResponse<T> {
	content: T[];
	page: number;
	size: number;
	total_elements: number;
	total_pages: number;
	number_of_elements: number;
	is_last: boolean;
	is_first: boolean;
	is_empty: boolean;
}

// API Error Response
export interface ApiError {
	detail?: string;
	errors?: string;
}

// API Success Response
export interface ApiSuccessMessage {
	message: string;
}

// Query Parameters for Lists
export interface QueryParams {
	page?: number;
	size?: number;
	sort?: string;
	direction?: "ASC" | "DESC";
}
