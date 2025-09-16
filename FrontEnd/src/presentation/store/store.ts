import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth/authSlice";
import adminManagerReducer from "./slices/admin/managerSlice";
import adminPlayerReducer from "./slices/admin/managerSlice";
import adminViewerReducer from "./slices/admin/managerSlice";
import managerProfileReducer from "./slices/admin/managerSlice";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        adminManagers: adminManagerReducer,
        adminPlayers: adminPlayerReducer,
        adminViewers: adminViewerReducer,
        managerProfile: managerProfileReducer,
        playerProfile: managerProfileReducer,
        viewerProfile: managerProfileReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;