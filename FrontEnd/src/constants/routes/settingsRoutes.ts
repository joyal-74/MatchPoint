import { API_PREFIX } from "../../utils/api";

export const SETTINGS_ROUTES = {
    VERIFY_PASSWORD: `${API_PREFIX}/settings/password/verify`,
    UPDATE_PASSWORD: `${API_PREFIX}/settings/password/update`,
    UPDATE_PRIVACY: `${API_PREFIX}/settings/privacy`,
    
} as const;