import { container } from "tsyringe";
import { DI_TOKENS } from "../../domain/constants/Identifiers.js";

import { LoginUser } from "../../app/usecases/auth/LoginUser.js";
import { LoginAdmin } from "../../app/usecases/auth/LoginAdmin.js";
import { SignupViewer } from "../../app/usecases/auth/SignupViewer.js";
import { SignupPlayer } from "../../app/usecases/auth/SignupPlayer.js";
import { LoginGoogleUser } from "../../app/usecases/auth/LoginGoogleUser.js";
import { LoginFacebookUser } from "../../app/usecases/auth/LoginFacebookUser.js";
import { CompleteSocialSignup } from "../../app/usecases/auth/CompleteSocialSignup.js";
import { SignupManager } from "../../app/usecases/auth/SignUpManager.js";
import { RefreshToken } from "../../app/usecases/auth/RefreshToken.js";
import { ForgotPassword } from "../../app/usecases/auth/ForgotPassword.js";
import { VerifyOtp } from "../../app/usecases/auth/VerifyOtp.js";
import { ResendOtp } from "../../app/usecases/auth/ResendOtp.js";
import { ResetPassword } from "../../app/usecases/auth/ResetPassword.js";

import { GetViewerDetails } from "../../app/usecases/admin/GetViewerDetails.js";
import { GetAdminTransactions } from "../../app/usecases/admin/GetAdminTransactions.js";
import { GetTransactionDetails } from "../../app/usecases/admin/GetTransactionDetails.js";
import { GetTeamDetails } from "../../app/usecases/admin/GetTeamDetails.js";
import { GetAllTournaments } from "../../app/usecases/admin/GetAllTournaments.js";
import { AdminGetTournamentDetails } from "../../app/usecases/admin/GetTournamentDetails.js";
import { AdminChangeTeamStatus } from "../../app/usecases/admin/ChangeTeamStatus.js";
import { ChangeTeamDetailStatus } from "../../app/usecases/admin/BlockTeamUsecase.js";
import { ChangeTournamentStatus } from "../../app/usecases/admin/ChangeTournamentStatus.js";
import { ChangeTournamentDetailStatus } from "../../app/usecases/admin/BlockTournamentStatus.js";
import { GetPlansUseCase } from "../../app/usecases/admin/GetPlansUseCase.js";
import { CreatePlanUseCase } from "../../app/usecases/admin/CreatePlanUseCase.js";
import { DeletePlanUseCase } from "../../app/usecases/admin/DeletePlanUseCase.js";
import { UpdatePlanUseCase } from "../../app/usecases/admin/UpdatePlanUseCase.js";
import { GetDashboardStatsUseCase } from "../../app/usecases/admin/GetDashboardStatsUseCase.js";
import { GetAllManagers } from "../../app/usecases/admin/GetAllManagers.js";
import { GetAllPlayers } from "../../app/usecases/admin/GetAllPlayers.js";
import { GetAllViewers } from "../../app/usecases/admin/GetAllViewers.js";
import { GetManagerDetails } from "../../app/usecases/admin/GetManagerDetails.js";
import { GetPlayerDetails } from "../../app/usecases/admin/GetPlayerDetails.js";
import { ChangeUserStatus } from "../../app/usecases/admin/ChangeUserStatus.js";
import { ChangeBlockUserStatus } from "../../app/usecases/admin/ChangeBlockUserStatus.js";
import { GetUsersByRole } from "../../app/usecases/admin/GetUsersByRole.js";

import { VerifyPaymentUseCase } from "../../app/usecases/shared/VerifyPaymentUseCase.js";
import { UpdateUserPlan } from "../../app/usecases/shared/UpdateUserPlan.js";

import { AddNewTeamUseCase } from "../../app/usecases/manager/teams/AddNewTeam.js";
import { CreateChatForTeamUseCase } from "../../app/usecases/manager/teams/CreateChatForTeamUseCase.js";
import { InitInningsUseCase } from "../../app/usecases/manager/match/InitInningsUseCase.js";
import { AddRunsUseCase } from "../../app/usecases/manager/match/AddRunsUseCase.js";
import { SetStrikerUseCase } from "../../app/usecases/manager/match/SetStrikerUseCase.js";
import { SetNonStrikerUseCase } from "../../app/usecases/manager/match/SetNonStrikerUseCase.js";
import { SetBowlerUseCase } from "../../app/usecases/manager/match/SetBowlerUseCase.js";
import { AddWicketUseCase } from "../../app/usecases/manager/match/AddWicketUseCase.js";
import { AddExtrasUseCase } from "../../app/usecases/manager/match/AddExtrasUseCase.js";
import { UndoLastBallUseCase } from "../../app/usecases/manager/match/UndoLastBallUseCase.js";
import { StartSuperOverUseCase } from "../../app/usecases/manager/match/StartSuperOverUseCase.js";
import { EndOverUseCase } from "../../app/usecases/manager/match/EndOverUseCase.js";
import { EndInningsUseCase } from "../../app/usecases/manager/match/EndInningsUseCase.js";
import { AddPenaltyUseCase } from "../../app/usecases/manager/match/AddPenaltyUseCase.js";
import { RetireBatsmanUseCase } from "../../app/usecases/manager/match/RetireBatsmanUseCase.js";
import { EndMatchUseCase } from "../../app/usecases/manager/match/EndMatchUseCase.js";

// Manager - Financials & Profile
import { GetManagerFinancialsUseCase } from "../../app/usecases/player/GetManagerFinancialsUseCase.js";
import { GetManagerProfile } from "../../app/usecases/manager/GetManagerProfile.js";
import { UpdateManagerProfile } from "../../app/usecases/manager/UpdateManagerProfile.js";

// Manager - Team Operations
import { EditTeamUseCase } from "../../app/usecases/manager/teams/EditTeam.js";
import { GetAllTeamUseCase } from "../../app/usecases/manager/teams/GetAllTeamsUseCase.js";
import { GetMyTeamDetails } from "../../app/usecases/manager/GetMyTeamDetails.js";
import { ApprovePlayerUseCase } from "../../app/usecases/manager/teams/ApprovePlayer.js";
import { RejectPlayerUseCase } from "../../app/usecases/manager/teams/RejectPlayer.js";
import { SwapPlayers } from "../../app/usecases/manager/teams/SwapPlayers.js";
import { RemovePlayerUseCase } from "../../app/usecases/manager/teams/RemovePlayer.js";
import { GetAvailablePlayersService } from "../../infra/services/GetAvailablePlayersService.js";

// Manager - Tournaments
import { GetMyTournamentsUseCase } from "../../app/usecases/manager/tournaments/GetMyTournaments.js";
import { ExploreTournamentsUseCase } from "../../app/usecases/manager/tournaments/GetExploreTournaments.js";
import { AddTournamentUseCase } from "../../app/usecases/manager/tournaments/AddTournament.js";
import { EditTournamentUseCase } from "../../app/usecases/manager/tournaments/EditTournament.js";
import { CancelTournamentUsecase } from "../../app/usecases/manager/tournaments/CancelTournament.js";
import { GetTournamentDetails } from "../../app/usecases/manager/tournaments/TournamentDetails.js";
import { UpdateTournamentTeam } from "../../app/usecases/manager/tournaments/UpdateTournamentTeam.js";
import { GetRegisteredTeams } from "../../app/usecases/manager/tournaments/GetRegisteredTeams.js";

// Manager - Fixtures & Matches
import { GetTournamentFixtures } from "../../app/usecases/manager/tournaments/fixtures/GetTournamentFixtures.js";
import { CreateFixtureUseCase } from "../../app/usecases/manager/tournaments/fixtures/CreateTournamentFixtures.js";
import { CreateMatchesUseCase } from "../../app/usecases/manager/tournaments/matches/CreateMatchesUseCase.js";
import { GetTournamentMatches } from "../../app/usecases/manager/tournaments/matches/GetMatchesUseCase.js";
import { GetTourLeaderboard } from "../../app/usecases/manager/tournaments/GetLeaderboardUseCase.js";
import { GetLiveScoreUseCase } from "../../app/usecases/manager/match/GetLiveScoreUseCase.js";

// Player Use Cases
import { GetChatsUseCase } from "../../app/usecases/player/chat/GetChatsUsecase.js";
import { SendMessageUseCase } from "../../app/usecases/player/chat/SendMessageUseCase.js";
import { GetMessagesUseCase } from "../../app/usecases/player/chat/GetMessagesUseCase.js";
import { UpdateMessageStatusUseCase } from "../../app/usecases/player/chat/UpdateMessageStatusUseCase.js";
import { GetPlayerNotificationsUseCase } from "../../app/usecases/player/GetPlayerNotifications.js";
import { GetUnreadCountUseCase } from "../../app/usecases/player/GetUnreadCountUseCase.js";
import { GetPlayerProfile } from "../../app/usecases/player/GetPlayerProfile.js";
import { UpdatePlayerProfile } from "../../app/usecases/player/UpdatePlayerProfile.js";
import { JoinTeamUseCase } from "../../app/usecases/player/JoinTeams.js";
import { FetchTournamentsUseCase } from "../../app/usecases/player/FetchplayerTournaments.js";
import { ChangeTeamStatusUsecase } from "../../app/usecases/manager/teams/ChangeTeamStatus.js";
import { InitiateTournamentPayment } from "../../app/usecases/manager/tournaments/InitiateTournamentPayment.js";
import { VerifyPasswordUseCase } from "../../app/usecases/shared/VerifyPasswordUseCase.js";
import { UpdatePasswordUseCase } from "../../app/usecases/shared/UpdatePasswordUseCase.js";
import { UpdatePrivacyUseCase } from "../../app/usecases/shared/UpdatePrivacyUseCase.js";
import { GetPlansAndUserSubscription } from "../../infra/services/GetPlansAndUserSubscription.js";
import { CreatePaymentSession } from "../../app/usecases/shared/InitiateOrderUseCase.js";
import { SubscriptionPaymentService } from "../../infra/services/SubscriptionService.js";
import { AddPlayerToTeamUseCase } from "../../app/usecases/manager/teams/AddPlayerToTeamUseCase.js";
import { SaveMatchData } from "../../app/usecases/manager/SaveMatchData.js";
import { UpdatePlayerFields } from "../../app/usecases/player/UpdateProfileFields.js";
import { UpdatePlayerInviteStatus } from "../../app/usecases/player/UpdatePlayerInviteStatus.js";
import { GetLiveMatches } from "../../app/usecases/viewer/GetLiveMatches.js";
import { GetMatchUpdates } from "../../app/usecases/viewer/GetMatchUpdateData.js";
import { GetViewerProfile } from "../../app/usecases/viewer/GetViewerProfile.js";
import { UpdateViewerProfile } from "../../app/usecases/viewer/UpdateViewerProfile.js";
import { LogoutUser } from "../../app/usecases/auth/Logout.js"; 
import { FetchMatchesUseCase } from "../../app/usecases/player/FetchPlayerMatches.js";
import { PlayerTournamentDetails } from "../../app/usecases/player/TournamentDetails.js";
import { GetDashboardAnalytics } from "../../app/usecases/manager/GetDashboardAnalytics.js";
import { UpdateUserDirectlyPlan } from "../../app/usecases/shared/UpdatPlanDirectly.js";
import { GetPlayerTeamsUseCase } from "../../app/usecases/player/GetPlayerTeams.js"; 
import { GetPlayerJoinedTeamsUseCase } from "../../app/usecases/player/GetAllMyTeams.js"; 
import { GetAllTeams } from "../../app/usecases/admin/GetAllTeams.js";
import { StartMatchUseCase } from "../../app/usecases/manager/match/StartMatchUseCase.js";
import { GetLeaderboard } from "../../app/usecases/shared/GetLeaderboard.js";
import { GetPointsTableUseCase } from "../../app/usecases/manager/tournaments/GetPointsTable.js";
import { GetPlayerTournamentMatches } from "../../app/usecases/player/PlayerTournamentMatches.js";
import { GetTournamentPointsTable } from "../../app/usecases/player/TournamentPointsTable.js";
import { GetTournamentStats } from "../../app/usecases/player/GetTournamentStats.js";
import { MarkNotificationRead } from "../../app/usecases/shared/MarkNotificationAsRead.js";
import { MarkAllNotificationRead } from "../../app/usecases/shared/MarkAllNotificationRead.js";
import { GetMyTournamentMatchResult } from "../../app/usecases/manager/tournaments/GetMatchResults.js";
import { SignupUmpire } from "../../app/usecases/auth/SignupUmpire.js";
import { UpdateUmpireProfile } from "../../app/usecases/umpire/UpdateUmpireProfile.js";
import { GetUmpireProfile } from "../../app/usecases/umpire/GetUmpireProfile.js";
import { GetViewerTournamentsUseCase } from "../../app/usecases/viewer/GetViewerTournaments.js";
import { GetAllMatches } from "../../app/usecases/manager/match/GetAllMatches.js";
import { GetUmpireAllMatches } from "../../app/usecases/umpire/GetAllMatches.js";
import { GetPlayerStats } from "../../app/usecases/player/GetPlayerStats.js";
import { PlayerLeaveTeamUseCase } from "../../app/usecases/player/PlayerLeaveTeam.js";
import { GetUserSubscriptionPlan } from "../../app/usecases/shared/GetUserPlan.js";
import { SavePayoutMethodUseCase } from "../../app/usecases/shared/SavePayoutMethodUseCase.js";
import { GetPayoutMethodsUseCase } from "../../app/usecases/shared/GetPayoutMethodsUseCase.js";
import { DeletePayoutMethodUseCase } from "../../app/usecases/shared/DeletePayoutMethodUseCase.js";
import { VerifyWalletPaymentUseCase } from "../../app/usecases/shared/VerifyWalletPaymentUseCase.js";
import { CreateWalletOrderUseCase } from "../../app/usecases/shared/CreateWalletOrderUseCase.js";
import { InitiateWithdrawalUseCase } from "../../app/usecases/shared/InitiateWithdrawalUseCase.js";
import { HandlePayoutWebhookUseCase } from "../../app/usecases/shared/HandlePayoutWebhook.js";
import { GetUserWalletUseCase } from "../../app/usecases/shared/GetUserWalletUseCase.js";


// Registrations
container.register(DI_TOKENS.LoginUserUseCase, { useClass: LoginUser });
container.register(DI_TOKENS.LoginAdminUseCase, { useClass: LoginAdmin });
container.register(DI_TOKENS.SignupViewerUseCase, { useClass: SignupViewer });
container.register(DI_TOKENS.SignupPlayerUseCase, { useClass: SignupPlayer });
container.register(DI_TOKENS.SignupUmpireUseCase, { useClass: SignupUmpire });
container.register(DI_TOKENS.LogoutUseCase, { useClass: LogoutUser });

// --- Added Registrations ---
container.register(DI_TOKENS.SignupManagerUseCase, { useClass: SignupManager });
container.register(DI_TOKENS.LoginGoogleUseCase, { useClass: LoginGoogleUser });
container.register(DI_TOKENS.LoginFacebookUseCase, { useClass: LoginFacebookUser });
container.register(DI_TOKENS.CompleteSocialProfileUseCase, { useClass: CompleteSocialSignup });
container.register(DI_TOKENS.RefreshTokenUseCase, { useClass: RefreshToken });

// Password & OTP Management
container.register(DI_TOKENS.ForgotPasswordUseCase, { useClass: ForgotPassword });
container.register(DI_TOKENS.VerifyOtpUseCase, { useClass: VerifyOtp });
container.register(DI_TOKENS.ResendOtpUseCase, { useClass: ResendOtp });
container.register(DI_TOKENS.ResetPasswordUseCase, { useClass: ResetPassword });


// Users
container.register(DI_TOKENS.GetAllManagersUseCase, { useClass: GetAllManagers });
container.register(DI_TOKENS.GetAllPlayersUseCase, { useClass: GetAllPlayers });
container.register(DI_TOKENS.GetAllViewersUseCase, { useClass: GetAllViewers });
container.register(DI_TOKENS.GetManagerDetailsUseCase, { useClass: GetManagerDetails });
container.register(DI_TOKENS.GetPlayerDetailsUseCase, { useClass: GetPlayerDetails });
container.register(DI_TOKENS.GetViewerDetailsUseCase, { useClass: GetViewerDetails });
container.register(DI_TOKENS.ChangeUserStatusUseCase, { useClass: ChangeUserStatus });
container.register(DI_TOKENS.ChangeBlockUserStatusUseCase, { useClass: ChangeBlockUserStatus });
container.register(DI_TOKENS.GetUsersByRoleUseCase, { useClass: GetUsersByRole });

// Transactions
container.register(DI_TOKENS.GetAdminTransactionsUseCase, { useClass: GetAdminTransactions });
container.register(DI_TOKENS.GetTransactionDetailsUseCase, { useClass: GetTransactionDetails });

// Teams & Tournaments

container.register(DI_TOKENS.GetAllTeamsUseCase, { useClass: GetAllTeams });
container.register(DI_TOKENS.GetTeamDetailsUseCase, { useClass: GetTeamDetails });
container.register(DI_TOKENS.GetAllTournamentsUseCase, { useClass: GetAllTournaments });
container.register(DI_TOKENS.GetTournamentDetailsUseCase, { useClass: AdminGetTournamentDetails });
container.register(DI_TOKENS.ChangeTeamStatusUseCase, { useClass: AdminChangeTeamStatus });
container.register(DI_TOKENS.ChangeTeamDetailStatusUseCase, { useClass: ChangeTeamDetailStatus });
container.register(DI_TOKENS.ChangeTournamentStatusUseCase, { useClass: ChangeTournamentStatus });
container.register(DI_TOKENS.ChangeTournamentDetailStatusUseCase, { useClass: ChangeTournamentDetailStatus });

// Plans
container.register(DI_TOKENS.GetPlansUseCase, { useClass: GetPlansUseCase });
container.register(DI_TOKENS.CreatePlanUseCase, { useClass: CreatePlanUseCase });
container.register(DI_TOKENS.DeletePlanUseCase, { useClass: DeletePlanUseCase });
container.register(DI_TOKENS.UpdatePlanUseCase, { useClass: UpdatePlanUseCase });

// Dashboard
container.register(DI_TOKENS.GetDashboardStatsUseCase, { useClass: GetDashboardStatsUseCase });

// Match
container.register(DI_TOKENS.InitInningsUseCase, { useClass: InitInningsUseCase });
container.register(DI_TOKENS.AddRunsUseCase, { useClass: AddRunsUseCase });
container.register(DI_TOKENS.SetStrikerUseCase, { useClass: SetStrikerUseCase });
container.register(DI_TOKENS.SetNonStrikerUseCase, { useClass: SetNonStrikerUseCase });
container.register(DI_TOKENS.SetBowlerUseCase, { useClass: SetBowlerUseCase });
container.register(DI_TOKENS.AddWicketUseCase, { useClass: AddWicketUseCase });
container.register(DI_TOKENS.AddExtrasUseCase, { useClass: AddExtrasUseCase });
container.register(DI_TOKENS.UndoLastBallUseCase, { useClass: UndoLastBallUseCase });
container.register(DI_TOKENS.StartSuperOverUseCase, { useClass: StartSuperOverUseCase });
container.register(DI_TOKENS.EndOverUseCase, { useClass: EndOverUseCase });
container.register(DI_TOKENS.EndInningsUseCase, { useClass: EndInningsUseCase });
container.register(DI_TOKENS.AddPenaltyUseCase, { useClass: AddPenaltyUseCase });
container.register(DI_TOKENS.RetireBatsmanUseCase, { useClass: RetireBatsmanUseCase });
container.register(DI_TOKENS.EndMatchUseCase, { useClass: EndMatchUseCase });


// --- Manager Financials & Profile ---
container.register(DI_TOKENS.GetManagerFinancialsUseCase, { useClass: GetManagerFinancialsUseCase });
container.register(DI_TOKENS.GetManagerProfileUsecase, { useClass: GetManagerProfile });
container.register(DI_TOKENS.UpdateManagerProfile, { useClass: UpdateManagerProfile });

// --- Manager Team Operations ---
container.register(DI_TOKENS.AddNewTeamUseCase, { useClass: AddNewTeamUseCase });
container.register(DI_TOKENS.CreateChatForTeamUseCase, { useClass: CreateChatForTeamUseCase });
container.register(DI_TOKENS.EditTeamUsecase, { useClass: EditTeamUseCase });
container.register(DI_TOKENS.GetTeamsUsecase, { useClass: GetAllTeamUseCase });
container.register(DI_TOKENS.GetmyTeamsDetailsUsecase, { useClass: GetMyTeamDetails });
container.register(DI_TOKENS.ChangeStatusUsecase, { useClass: ChangeTeamStatusUsecase });
container.register(DI_TOKENS.ApprovetoTeamUsecase, { useClass: ApprovePlayerUseCase });
container.register(DI_TOKENS.RejectfromTeamUsecase, { useClass: RejectPlayerUseCase });
container.register(DI_TOKENS.SwapPlayersUsecase, { useClass: SwapPlayers });
container.register(DI_TOKENS.RemovePlayersUsecase, { useClass: RemovePlayerUseCase });
container.register(DI_TOKENS.GetAvilablePlayersService, { useClass: GetAvailablePlayersService });
container.register(DI_TOKENS.AddnewPlayerUsecase, { useClass: AddPlayerToTeamUseCase });

// --- Manager Tournament Operations ---
container.register(DI_TOKENS.GetMyTournamentsUsecase, { useClass: GetMyTournamentsUseCase });
container.register(DI_TOKENS.GetExploreTournamentsUsecase, { useClass: ExploreTournamentsUseCase });
container.register(DI_TOKENS.AddTournamentsUsecase, { useClass: AddTournamentUseCase });
container.register(DI_TOKENS.EditTournamentsUsecase, { useClass: EditTournamentUseCase });
container.register(DI_TOKENS.CancelTournamentsUsecase, { useClass: CancelTournamentUsecase });
container.register(DI_TOKENS.TournamentsDetailsUsecase, { useClass: GetTournamentDetails });
container.register(DI_TOKENS.EntryFeePaymentUsecase, { useClass: InitiateTournamentPayment });
container.register(DI_TOKENS.UpdateTournamenTeamUsecase, { useClass: UpdateTournamentTeam });
container.register(DI_TOKENS.TournamentTeamsUsecase, { useClass: GetRegisteredTeams });
container.register(DI_TOKENS.SaveMatchData, { useClass: SaveMatchData });
container.register(DI_TOKENS.GetTourLeaderboard, { useClass: GetTourLeaderboard });
container.register(DI_TOKENS.GetDashboardAnalytics, { useClass: GetDashboardAnalytics });

// --- Manager Fixtures & Matches ---
container.register(DI_TOKENS.GetFixturesUsecase, { useClass: GetTournamentFixtures });
container.register(DI_TOKENS.CreateFixturesUsecase, { useClass: CreateFixtureUseCase });
container.register(DI_TOKENS.CreateMatchesUsecase, { useClass: CreateMatchesUseCase });
container.register(DI_TOKENS.GetMatchesUsecase, { useClass: GetTournamentMatches });
container.register(DI_TOKENS.StartMatchUseCase, { useClass: StartMatchUseCase });
container.register(DI_TOKENS.GetLeaderBoardUsecase, { useClass: GetLeaderboard });
container.register(DI_TOKENS.GetLiveScoreUseCase, { useClass: GetLiveScoreUseCase });
container.register(DI_TOKENS.GetPointsTableUseCase, { useClass: GetPointsTableUseCase });
container.register(DI_TOKENS.GetMyTournamentMatchResult, { useClass: GetMyTournamentMatchResult });
container.register(DI_TOKENS.GetAllMatches, { useClass: GetAllMatches });

// --- Player Use Cases ---
container.register(DI_TOKENS.GetChatsUseCase, { useClass: GetChatsUseCase });
container.register(DI_TOKENS.SendMessageUseCase, { useClass: SendMessageUseCase });
container.register(DI_TOKENS.GetMessagesUseCase, { useClass: GetMessagesUseCase });
container.register(DI_TOKENS.UpdateMessageStatusUseCase, { useClass: UpdateMessageStatusUseCase });
container.register(DI_TOKENS.GetPlayerNotificationsUseCase, { useClass: GetPlayerNotificationsUseCase });
container.register(DI_TOKENS.GetUnreadCountUseCase, { useClass: GetUnreadCountUseCase });
container.register(DI_TOKENS.GetPlayerProfile, { useClass: GetPlayerProfile });
container.register(DI_TOKENS.UpdatePlayerProfile, { useClass: UpdatePlayerProfile });
container.register(DI_TOKENS.UpdatePlayerFields, { useClass: UpdatePlayerFields });
container.register(DI_TOKENS.UpdatePlayerInviteStatus, { useClass: UpdatePlayerInviteStatus });
container.register(DI_TOKENS.GetLiveMatches, { useClass: GetLiveMatches });
container.register(DI_TOKENS.GetMatchUpdates, { useClass: GetMatchUpdates });
container.register(DI_TOKENS.JoinTeamUseCase, { useClass: JoinTeamUseCase });
container.register(DI_TOKENS.GetPlayerTeamsUseCase, { useClass: GetPlayerTeamsUseCase });
container.register(DI_TOKENS.GetPlayerJoinedTeamsUseCase, { useClass: GetPlayerJoinedTeamsUseCase });
container.register(DI_TOKENS.GetMyTeamDetailsUseCase, { useClass: GetMyTeamDetails });
container.register(DI_TOKENS.GetPlayerTournaments, { useClass: FetchTournamentsUseCase });
container.register(DI_TOKENS.GetPlayerTournamentDetails, { useClass: PlayerTournamentDetails });
container.register(DI_TOKENS.FetchMatchesUseCase, { useClass: FetchMatchesUseCase });
container.register(DI_TOKENS.GetPlayerTournamentMatches, { useClass: GetPlayerTournamentMatches });
container.register(DI_TOKENS.GetTournamentPointsTable, { useClass: GetTournamentPointsTable });
container.register(DI_TOKENS.GetTournamentStats, { useClass: GetTournamentStats });
container.register(DI_TOKENS.GetPlayerStats, { useClass: GetPlayerStats });
container.register(DI_TOKENS.PlayerLeaveTeamUseCase, { useClass: PlayerLeaveTeamUseCase });

// --- Shared Use Cases ---
container.register(DI_TOKENS.VerifyPaymentUseCase, { useClass: VerifyPaymentUseCase });
container.register(DI_TOKENS.UpdateUserPlanUseCase, { useClass: UpdateUserPlan });
container.register(DI_TOKENS.UpdateUserDirectlyPlan, { useClass: UpdateUserDirectlyPlan });
container.register(DI_TOKENS.VerifyPasswordUseCase, { useClass: VerifyPasswordUseCase });
container.register(DI_TOKENS.UpdatePasswordUseCase, { useClass: UpdatePasswordUseCase });
container.register(DI_TOKENS.UpdatePrivacyUseCase, { useClass: UpdatePrivacyUseCase });
container.register(DI_TOKENS.GetPlansAndUserSubscription, { useClass: GetPlansAndUserSubscription });
container.register(DI_TOKENS.CreatePaymentSession, { useClass: CreatePaymentSession });
container.register(DI_TOKENS.SubscriptionService, { useClass: SubscriptionPaymentService });
container.register(DI_TOKENS.MarkNotificationRead, { useClass: MarkNotificationRead });
container.register(DI_TOKENS.MarkAllNotificationRead, { useClass: MarkAllNotificationRead });
container.register(DI_TOKENS.GetUserSubscriptionPlan, { useClass: GetUserSubscriptionPlan });
container.register(DI_TOKENS.SavePayoutMethodUseCase, { useClass: SavePayoutMethodUseCase });
container.register(DI_TOKENS.GetPayoutMethodsUseCase, { useClass: GetPayoutMethodsUseCase });
container.register(DI_TOKENS.DeletePayoutMethodUseCase, { useClass: DeletePayoutMethodUseCase });
container.register(DI_TOKENS.CreateWalletOrderUseCase, { useClass: CreateWalletOrderUseCase });
container.register(DI_TOKENS.VerifyWalletPaymentUseCase, { useClass: VerifyWalletPaymentUseCase });
container.register(DI_TOKENS.InitiateWithdrawalUseCase, { useClass: InitiateWithdrawalUseCase });
container.register(DI_TOKENS.HandleWebhookUseCase, { useClass: HandlePayoutWebhookUseCase });
container.register(DI_TOKENS.GetUserWalletUseCase, { useClass: GetUserWalletUseCase });

// --- Viewer ---
container.register(DI_TOKENS.GetViewerProfile, { useClass: GetViewerProfile });
container.register(DI_TOKENS.UpdateViewerProfile, { useClass: UpdateViewerProfile });
container.register(DI_TOKENS.GetViewerTournamentsUseCase, { useClass: GetViewerTournamentsUseCase });

// --- Umpire ---
container.register(DI_TOKENS.GetUmpireProfileUsecase, { useClass: GetUmpireProfile });
container.register(DI_TOKENS.UpdateUmpireProfile, { useClass: UpdateUmpireProfile });
container.register(DI_TOKENS.GetUmpireAllMatches, { useClass: GetUmpireAllMatches });
