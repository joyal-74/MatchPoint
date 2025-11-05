import { combineReducers, type UnknownAction } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import usersReducer from "../features/admin/users/userSlice";
import managerReducer from "../features/manager/managerSlice";
import playerReducer from "../features/player/playerSlice";
import viewerReducer from "../features/viewer/viewerSlice";
import managerTournamentReducer from "../features/manager/Tournaments/tournamentSlice";
import playerTeamsReducer from "../features/player/Teams/TeamSlice";
import playerTournamentReducer from "../features/player/Tournnaments/tournamnetSlice";

const appReducer = combineReducers({
    auth: authReducer,
    users: usersReducer,
    manager: managerReducer,
    player: playerReducer,
    viewer: viewerReducer,
    managerTournaments: managerTournamentReducer,
    playerTeams: playerTeamsReducer,
    playerTournaments: playerTournamentReducer,
});

export type RootState = ReturnType<typeof appReducer>;

const rootReducer = (state: RootState | undefined, action: UnknownAction) => {
    if (action.type.toLowerCase().includes('logout')) {
        return appReducer(undefined, action);
    }
    return appReducer(state, action);
};

export default rootReducer;