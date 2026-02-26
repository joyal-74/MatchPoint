import axios from "axios";

export const axiosClient = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error?.response?.status;
        const msg = error?.response?.data?.message;
        const url = error?.config?.url;

        if (status === 401 && url?.includes("/auth/refresh")) {
            return Promise.reject({
                ...error,
                isSilent: true 
            });
        }

        if (status === 403 && msg === "You are blocked") {
            try {
                await axiosClient.get("/auth/logout");
            } finally {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
