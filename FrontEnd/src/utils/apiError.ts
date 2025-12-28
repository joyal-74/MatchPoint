import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../types/api/ApiErrorResponse";

export const getApiErrorMessage = (error: unknown): string => {
    if (typeof error === "string") {
        return error;
    }

    if ((error as AxiosError)?.response?.data) {
        const data = (error as AxiosError).response!.data as ApiErrorResponse;
        return data.message || JSON.stringify(data) || "Something went wrong";
    }

    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === "object" && error !== null && "message" in error) {
        return String((error as any).message);
    }

    return "Something went wrong";
};