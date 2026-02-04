import { ApiResponse } from "../../domain/dtos/ApiResponse.js"; 

export const buildResponse = <T>(
    success: boolean,
    message: string,
    data?: T,
    error?: string
): ApiResponse<T> => {
    return { success, message, data, error };
};
