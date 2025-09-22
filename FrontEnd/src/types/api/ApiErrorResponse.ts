export interface ApiErrorResponse {
    message: string;
    errors?: ApiError[];
}

export interface ApiError {
    code: string;
    field?: string;
    message: string;
}
