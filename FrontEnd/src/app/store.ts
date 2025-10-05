import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import usersReducer from "../features/admin/users/userSlice";
import managerReducer from '../features/manager/managerSlice';
import managerTournamentReducer from '../features/manager/Tournaments/tournamentSlice'
import playerTeamsReducer from '../features/player/Teams/TeamSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        users: usersReducer,
        manager: managerReducer,
        managerTournaments: managerTournamentReducer,
        playerTeams: playerTeamsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;