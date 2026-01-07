import { container } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { LoginUser } from "app/usecases/auth/LoginUser";
import { LoginAdmin } from "app/usecases/auth/LoginAdmin";
import { SignupViewer } from "app/usecases/auth/SignupViewer";
import { SignupPlayer } from "app/usecases/auth/SignupPlayer";
import { LoginGoogleUser } from "app/usecases/auth/LoginGoogleUser";
import { LoginFacebookUser } from "app/usecases/auth/LoginFacebookUser";
import { CompleteSocialSignup } from "app/usecases/auth/CompleteSocialSignup";
import { SignupManager } from "app/usecases/auth/SignUpManager";
import { RefreshToken } from "app/usecases/auth/RefreshToken";
import { ForgotPassword } from "app/usecases/auth/ForgotPassword";
import { VerifyOtp } from "app/usecases/auth/VerifyOtp";
import { ResendOtp } from "app/usecases/auth/ResendOtp";
import { ResetPassword } from "app/usecases/auth/ResetPassword";

import { GetViewerDetails } from "app/usecases/admin/GetViewerDetails";
import { GetAdminTransactions } from "app/usecases/admin/GetAdminTransactions";
import { GetTransactionDetails } from "app/usecases/admin/GetTransactionDetails";
import { GetAllTeams } from "app/usecases/admin/GetAllTeams";
import { GetTeamDetails } from "app/usecases/admin/GetTeamDetails";
import { GetAllTournaments } from "app/usecases/admin/GetAllTournaments";
import { AdminGetTournamentDetails } from "app/usecases/admin/GetTournamentDetails";
import { AdminChangeTeamStatus } from "app/usecases/admin/ChangeTeamStatus";
import { ChangeTeamDetailStatus } from "app/usecases/admin/BlockTeamUsecase";
import { ChangeTournamentStatus } from "app/usecases/admin/ChangeTournamentStatus";
import { ChangeTournamentDetailStatus } from "app/usecases/admin/BlockTournamentStatus";
import { GetPlansUseCase } from "app/usecases/admin/GetPlansUseCase";
import { CreatePlanUseCase } from "app/usecases/admin/CreatePlanUseCase";
import { DeletePlanUseCase } from "app/usecases/admin/DeletePlanUseCase";
import { UpdatePlanUseCase } from "app/usecases/admin/UpdatePlanUseCase";
import { GetDashboardStatsUseCase } from "app/usecases/admin/GetDashboardStatsUseCase";
import { GetAllManagers } from "app/usecases/admin/GetAllManagers";
import { GetAllPlayers } from "app/usecases/admin/GetAllPlayers";
import { GetAllViewers } from "app/usecases/admin/GetAllViewers";
import { GetManagerDetails } from "app/usecases/admin/GetManagerDetails";
import { GetPlayerDetails } from "app/usecases/admin/GetPlayerDetails";
import { ChangeUserStatus } from "app/usecases/admin/ChangeUserStatus";
import { ChangeBlockUserStatus } from "app/usecases/admin/ChangeBlockUserStatus";
import { GetUsersByRole } from "app/usecases/admin/GetUsersByRole";

import { VerifyPaymentUseCase } from "app/usecases/shared/FinalizePaymentUseCase";
import { UpdateUserPlan } from "app/usecases/shared/UpdateUserPlan";

import { AddNewTeamUseCase } from "app/usecases/manager/teams/AddNewTeam";
import { CreateChatForTeamUseCase } from "app/usecases/manager/teams/CreateChatForTeamUseCase";
import { InitInningsUseCase } from "app/usecases/manager/match/InitInningsUseCase";
import { AddRunsUseCase } from "app/usecases/manager/match/AddRunsUseCase";
import { SetStrikerUseCase } from "app/usecases/manager/match/SetStrikerUseCase";
import { SetNonStrikerUseCase } from "app/usecases/manager/match/SetNonStrikerUseCase";
import { SetBowlerUseCase } from "app/usecases/manager/match/SetBowlerUseCase";
import { AddWicketUseCase } from "app/usecases/manager/match/AddWicketUseCase";
import { AddExtrasUseCase } from "app/usecases/manager/match/AddExtrasUseCase";
import { UndoLastBallUseCase } from "app/usecases/manager/match/UndoLastBallUseCase";
import { StartSuperOverUseCase } from "app/usecases/manager/match/StartSuperOverUseCase";
import { EndOverUseCase } from "app/usecases/manager/match/EndOverUseCase";
import { EndInningsUseCase } from "app/usecases/manager/match/EndInningsUseCase";
import { AddPenaltyUseCase } from "app/usecases/manager/match/AddPenaltyUseCase";
import { RetireBatsmanUseCase } from "app/usecases/manager/match/RetireBatsmanUseCase";
import { EndMatchUseCase } from "app/usecases/manager/match/EndMatchUseCase";

// Manager - Financials & Profile
import { GetManagerFinancialsUseCase } from "app/usecases/player/GetManagerFinancialsUseCase";
import { GetManagerProfile } from "app/usecases/manager/GetManagerProfile";
import { UpdateManagerProfile } from "app/usecases/manager/UpdateManagerProfile";

// Manager - Team Operations
import { EditTeamUseCase } from "app/usecases/manager/teams/EditTeam";
import { GetAllTeamUseCase } from "app/usecases/manager/teams/GetAllTeamsUseCase";
import { GetMyTeamDetails } from "app/usecases/manager/GetMyTeamDetails";
import { ApprovePlayerUseCase } from "app/usecases/manager/teams/ApprovePlayer";
import { RejectPlayerUseCase } from "app/usecases/manager/teams/RejectPlayer";
import { SwapPlayers } from "app/usecases/manager/teams/SwapPlayers";
import { RemovePlayerUseCase } from "app/usecases/manager/teams/RemovePlayer";
import { GetAvailablePlayersService } from "infra/services/GetAvailablePlayersService";

// Manager - Tournaments
import { GetMyTournamentsUseCase } from "app/usecases/manager/tournaments/GetMyTournaments";
import { ExploreTournamentsUseCase } from "app/usecases/manager/tournaments/GetExploreTournaments";
import { AddTournamentUseCase } from "app/usecases/manager/tournaments/AddTournament";
import { EditTournamentUseCase } from "app/usecases/manager/tournaments/EditTournament";
import { CancelTournamentUsecase } from "app/usecases/manager/tournaments/CancelTournament";
import { GetTournamentDetails } from "app/usecases/manager/tournaments/TournamentDetails";
import { UpdateTournamentTeam } from "app/usecases/manager/tournaments/UpdateTournamentTeam";
import { GetRegisteredTeams } from "app/usecases/manager/tournaments/GetRegisteredTeams";

// Manager - Fixtures & Matches
import { GetTournamentFixtures } from "app/usecases/manager/tournaments/fixtures/GetTournamentFixtures";
import { CreateFixtureUseCase } from "app/usecases/manager/tournaments/fixtures/CreateTournamentFixtures";
import { CreateMatchesUseCase } from "app/usecases/manager/tournaments/matches/CreateMatchesUseCase";
import { GetTournamentMatches } from "app/usecases/manager/tournaments/matches/GetMatchesUseCase";
import { GetTourLeaderboard } from "app/usecases/manager/tournaments/GetLeaderboardUseCase";
import { GetLiveScoreUseCase } from "app/usecases/manager/match/GetLiveScoreUseCase";

// Player Use Cases
import { GetChatsUseCase } from "app/usecases/player/chat/GetChatsUsecase";
import { SendMessageUseCase } from "app/usecases/player/chat/SendMessageUseCase";
import { GetMessagesUseCase } from "app/usecases/player/chat/GetMessagesUseCase";
import { UpdateMessageStatusUseCase } from "app/usecases/player/chat/UpdateMessageStatusUseCase";
import { GetPlayerNotificationsUseCase } from "app/usecases/player/GetPlayerNotifications";
import { GetUnreadCountUseCase } from "app/usecases/player/GetUnreadCountUseCase";
import { GetPlayerProfile } from "app/usecases/player/GetPlayerProfile";
import { UpdatePlayerProfile } from "app/usecases/player/UpdatePlayerProfile";
import { JoinTeamUseCase } from "app/usecases/player/JoinTeams";
import { GetAllPlayerTeamsUseCase } from "app/usecases/player/GetAllMyTeams";
import { FetchTournamentsUseCase } from "app/usecases/player/FetchplayerTournaments";
import { ChangeTeamStatusUsecase } from "app/usecases/manager/teams/ChangeTeamStatus";
import { InitiateTournamentPayment } from "app/usecases/manager/tournaments/InitiateTournamentPayment";
import { VerifyPasswordUseCase } from "app/usecases/shared/VerifyPasswordUseCase";
import { UpdatePasswordUseCase } from "app/usecases/shared/UpdatePasswordUseCase";
import { UpdatePrivacyUseCase } from "app/usecases/shared/UpdatePrivacyUseCase";
import { GetPlansAndUserSubscription } from "infra/services/GetPlansAndUserSubscription";
import { CreatePaymentSession } from "app/usecases/shared/InitiateOrderUseCase";
import { SubscriptionPaymentService } from "infra/services/SubscriptionService";
import { AddPlayerToTeamUseCase } from "app/usecases/manager/teams/AddPlayerToTeamUseCase";
import { SaveMatchData } from "app/usecases/manager/SaveMatchData";
import { UpdatePlayerFields } from "app/usecases/player/UpdateProfileFields";
import { UpdatePlayerInviteStatus } from "app/usecases/player/UpdatePlayerInviteStatus";
import { GetLiveMatches } from "app/usecases/viewer/GetLiveMatches";
import { GetMatchUpdates } from "app/usecases/viewer/GetMatchUpdateData";
import { GetViewerProfile } from "app/usecases/viewer/GetViewerProfile";
import { UpdateViewerProfile } from "app/usecases/viewer/UpdateViewerProfile";
import { LogoutUser } from "app/usecases/auth/Logout"; 


// Registrations
container.register(DI_TOKENS.LoginUserUseCase, { useClass: LoginUser });
container.register(DI_TOKENS.LoginAdminUseCase, { useClass: LoginAdmin });
container.register(DI_TOKENS.SignupViewerUseCase, { useClass: SignupViewer });
container.register(DI_TOKENS.SignupPlayerUseCase, { useClass: SignupPlayer });
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

// user (shared)
container.register(DI_TOKENS.VerifyPaymentUseCase, { useClass: VerifyPaymentUseCase });
container.register(DI_TOKENS.UpdateUserPlanUseCase, { useClass: UpdateUserPlan });

container.register(DI_TOKENS.AddNewTeamUseCase, { useClass: AddNewTeamUseCase });
container.register(DI_TOKENS.CreateChatForTeamUseCase, { useClass: CreateChatForTeamUseCase });


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

// --- Manager Fixtures & Matches ---
container.register(DI_TOKENS.GetFixturesUsecase, { useClass: GetTournamentFixtures });
container.register(DI_TOKENS.CreateFixturesUsecase, { useClass: CreateFixtureUseCase });
container.register(DI_TOKENS.CreateMatchesUsecase, { useClass: CreateMatchesUseCase });
container.register(DI_TOKENS.GetMatchesUsecase, { useClass: GetTournamentMatches });
container.register(DI_TOKENS.GetLeaderBoardUsecase, { useClass: GetTourLeaderboard });
container.register(DI_TOKENS.GetLiveScoreUseCase, { useClass: GetLiveScoreUseCase });

// --- Player Use Cases ---
container.register(DI_TOKENS.GetChatsUseCase, { useClass: GetChatsUseCase });
container.register(DI_TOKENS.SendMessageUseCase, { useClass: SendMessageUseCase });
container.register(DI_TOKENS.GetMessagesUseCase, { useClass: GetMessagesUseCase });
container.register(DI_TOKENS.UpdateMessageStatusUseCase, { useClass: UpdateMessageStatusUseCase });
container.register(DI_TOKENS.GetPlayerNotificationsUseCase, { useClass: GetPlayerNotificationsUseCase });
container.register(DI_TOKENS.GetUnreadCountUseCase, { useClass: GetUnreadCountUseCase });
container.register(DI_TOKENS.GetPlayerProfile, { useClass: GetPlayerProfile });
container.register(DI_TOKENS.UpdatePlayerProfile, { useClass: UpdatePlayerProfile });
container.register(DI_TOKENS.GetAllTeamsPlayerUseCase, { useClass: GetAllPlayerTeamsUseCase });
container.register(DI_TOKENS.UpdatePlayerFields, { useClass: UpdatePlayerFields });
container.register(DI_TOKENS.UpdatePlayerInviteStatus, { useClass: UpdatePlayerInviteStatus });
container.register(DI_TOKENS.GetLiveMatches, { useClass: GetLiveMatches });
container.register(DI_TOKENS.GetMatchUpdates, { useClass: GetMatchUpdates });
container.register(DI_TOKENS.JoinTeamUseCase, { useClass: JoinTeamUseCase });
container.register(DI_TOKENS.GetMyTeamsUseCase, { useClass: GetAllPlayerTeamsUseCase });
container.register(DI_TOKENS.GetPlayerTournaments, { useClass: FetchTournamentsUseCase });

// --- Shared Use Cases ---
container.register(DI_TOKENS.VerifyPasswordUseCase, { useClass: VerifyPasswordUseCase });
container.register(DI_TOKENS.UpdatePasswordUseCase, { useClass: UpdatePasswordUseCase });
container.register(DI_TOKENS.UpdatePrivacyUseCase, { useClass: UpdatePrivacyUseCase });
container.register(DI_TOKENS.GetPlansAndUserSubscription, { useClass: GetPlansAndUserSubscription });
container.register(DI_TOKENS.CreatePaymentSession, { useClass: CreatePaymentSession });
container.register(DI_TOKENS.SubscriptionService, { useClass: SubscriptionPaymentService });

// --- Viewer ---
container.register(DI_TOKENS.GetViewerProfile, { useClass: GetViewerProfile });
container.register(DI_TOKENS.UpdateViewerProfile, { useClass: UpdateViewerProfile });