import axios from "axios";

export const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true,
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const msg = error?.response?.data?.message;

        if (status === 403 && msg === "You are blocked") {
            axiosClient.get("/auth/logout").finally(() => {
                window.location.href = "/login";
            });
        }

        return Promise.reject(error);
    }
);


export default axiosClient;