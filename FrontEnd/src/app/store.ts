import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import usersReducer from "../features/admin/users/userSlice";
import managerReducer from '../features/manager/managerSlice';
import managerTournamentReducer from '../features/manager/Tournaments/TournamentSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        users : usersReducer,
        manager : managerReducer,
        managerTournaments: managerTournamentReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;