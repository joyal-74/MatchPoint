export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
    errors?: ApiError[];
    meta?: ApiMeta;
}

export interface ApiError {
    code: string;
    field?: string;
    message: string;
}

export interface ApiMeta {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
}
