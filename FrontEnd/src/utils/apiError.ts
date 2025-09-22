import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../types/api/ApiErrorResponse";

export const getApiErrorMessage = (error: unknown): string => {
    if ((error as AxiosError)?.response?.data) {
        const data = (error as AxiosError).response!.data as ApiErrorResponse;
        return data.message || "Something went wrong";
    }
    return "Something went wrong";
};
