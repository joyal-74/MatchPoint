import axios from "axios";
import { getApiErrorMessage } from "../../utils/apiError";

export const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(new Error(getApiErrorMessage(error)));
    }
);

export default axiosClient;