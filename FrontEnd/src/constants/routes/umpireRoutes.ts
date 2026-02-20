import { API_PREFIX } from "../../utils/api";

export const UMPIRE_ROUTES = {
    GET_DETAILS: (umpireId: string) => `${API_PREFIX}/umpire/${umpireId}`,
    EDIT_DETAILS: (umpireId: string) => `${API_PREFIX}/umpire/${umpireId}`,
    GET_All_MATCHES: (umpireId: string) => `${API_PREFIX}/umpire/${umpireId}/matches`,
} as const;