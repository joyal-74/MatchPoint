import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import usersReducer from "../features/admin/users/userSlice";
import managerReducer from '../features/manager/managerSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        users : usersReducer,
        manager : managerReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;