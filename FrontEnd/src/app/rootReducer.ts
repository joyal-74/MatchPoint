import { combineReducers, type UnknownAction } from "@reduxjs/toolkit";
import authReducer, { resetAuthState } from "../features/auth/authSlice";
import usersReducer from "../features/admin/users/userSlice";
import managerReducer from "../features/manager/managerSlice";
import playerReducer from "../features/player/playerSlice";
import viewerReducer from "../features/viewer/viewerSlice";
import umpireReducer from "../features/umpire/umpireSlice";
import managerTournamentReducer from "../features/manager/Tournaments/tournamentSlice";
import playerTeamsReducer from "../features/player/Teams/TeamSlice";
import playerTournamentReducer from "../features/player/Tournnaments/tournamnetSlice";
import teamMessageReducer from "../features/player/Chat/messages/messagesSlice";
import teamChatReducer from "../features/player/Chat/chatSlice";
import subscriptionReducer from "../features/admin/subscription/subscriptionSlice";
import userSubscriptionReducer from "../features/shared/subscription/subscriptionSlice";
import leaderboardReducer from "../features/shared/leaderboard/leaderboardSlice";
import matchReducer from "../features/manager/Matches/matchSlice";
import settingsReducer from "../features/shared/settings/settingsSlice";
import notificationsReducer from "../features/player/notifications/notificationSlice";
import adminTournamnetReducer from "../features/admin/tournament/tournamentSlice";
import dashboardStatsReducer from "../features/admin/dashboard/dashboardSlice";
import financialReducer from "../features/manager/financials/financialSlice";
import adminTransactionReducer from "../features/admin/transaction/transactionSlice";
import { logoutUser } from "../features/auth";


const appReducer = combineReducers({
    auth: authReducer,
    users: usersReducer,
    manager: managerReducer,
    player: playerReducer,
    viewer: viewerReducer,
    umpire: umpireReducer,
    managerTournaments: managerTournamentReducer,
    playerTeams: playerTeamsReducer,
    playerTournaments: playerTournamentReducer,
    messages: teamMessageReducer,
    chats: teamChatReducer,
    subscription: subscriptionReducer,
    userSubscription: userSubscriptionReducer,
    leaderboard: leaderboardReducer,
    match: matchReducer,
    settings : settingsReducer,
    notifications : notificationsReducer,
    adminTournaments : adminTournamnetReducer,
    adminDashboard : dashboardStatsReducer,
    financials : financialReducer,
    adminTransactions : adminTransactionReducer
});

export type RootState = ReturnType<typeof appReducer>;

const rootReducer = (state: RootState | undefined, action: UnknownAction) => {
    if (action.type === logoutUser.fulfilled.type) {
        return appReducer(undefined, action);
    }

    if (action.type === resetAuthState.type) {
        return appReducer(undefined, action);
    }

    return appReducer(state, action);
};

export default rootReducer;