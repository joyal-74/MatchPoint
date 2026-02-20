// providers
const ProviderTokens = {
    Logger: "Logger",
    JWTService: "JWTService",
    Mailer: "Mailer",
    OtpGenerator: "OtpGenerator",
    PasswordHasher: "PasswordHasher",
    FileStorage: "FileStorage",
    WalletProvider: "WalletProvider",
    PaymentProvider: "PaymentProvider",
    IdGenerator: "IdGenerator",
    ManagerIdGenerator: "ManagerIdGenerator",
    PlayerIdGenerator: "PlayerIdGenerator",
    UserIdGenerator: "UserIdGenerator",
    UmpireIdGenerator: "UmpireIdGenerator",
    TeamIdGenerator: "TeamIdGenerator",
    TournamentIdGenerator: "TournamentIdGenerator",
    RoleIdGenerator: "RoleIdGenerator",
    ConfigProvider: "ConfigProvider",
    RoomRegistry: "RoomRegistry",
    UnitOfWork: "UnitOfWork",
    GoogleAuthService: "GoogleAuthService",
    FacebookServices: "FacebookServices",
    Scheduler: "Scheduler",
    EncryptionProvider: "EncryptionProvider",
    TournamentPaymentProcessor: "TournamentPaymentProcessor",
    PayoutProvider: "PayoutProvider",
    PayoutResolver: "PayoutResolver",
}

// repository
const RepositoryTokens = {
    UserRepository: "UserRepository",
    AdminRepository: "AdminRepository",
    ManagerRepository: "ManagerRepository",
    PlayerRepository: "PlayerRepository",
    TeamRepository: "TeamRepository",
    TournamentRepository: "TournamentRepository",
    RegistrationRepository: "RegistrationRepository",
    FixturesRepository: "FixturesRepository",
    MatchesRepository: "MatchesRepository",
    MatchStatsRepository: "MatchStatsRepository",
    ChatRepository: "ChatRepository",
    MessageRepository: "MessageRepository",
    PlanRepository: "PlanRepository",
    SubscriptionRepository: "SubscriptionRepository",
    LeaderboardRepository: "LeaderboardRepository",
    SettingsRepository: "SettingsRepository",
    TransactionRepository: "TransactionRepository",
    DashboardRepository: "DashboardRepository",
    FinancialRepository: "FinancialRepository",
    NotificationRepository: "NotificationRepository",
    WalletRepository: "WalletRepository",
    OtpRepository: "OtpRepository",
    PointsTableRepository: "PointsTableRepository",
    PayoutRepository: "PayoutRepository",
    PayoutMappingRepository: "PayoutMappingRepository",
}

// services
const ServiceTokens = {
    UserManagementService: "UserManagementService",
    MatchPlayerServices: "MatchPlayerServices",
    MatchScoreService: "MatchScoreService",
    TeamSetupService: "TeamSetupService",
    GetAvailablePlayersService: "GetAvailablePlayersService",
    TournamentRegistrationValidator: "TournamentRegistrationValidator",
    PlayerService: "PlayerService",
    LogoutService: "LogoutService",
    PlayerTeamServices: "PlayerTeamServices",
    UserServices: "UserServices",
    UserAuthServices: "UserAuthServices",
    LiveStreamService: "LiveStreamService",
    TransactionService: "TransactionService",
    SubscriptionPaymentService: "SubscriptionPaymentService",
    GetPlansAndUserSubscription: "GetPlansAndUserSubscription",
    StartTournament: "StartTournament",
    TournamentRefundService: "TournamentRefundService",
    PayoutMethodResolver: "PayoutMethodResolver",
    WebhookService: "WebhookService",
    ProfileInitializationService: "ProfileInitializationService",
}

const StategyTokens = {
    PaymentStrategy : 'PaymentStrategy',
    PaymentStrategyRegistry : 'PaymentStrategyRegistry',
}

// usecases
const AuthUsecaseTokens = {
    LoginUserUseCase: "LoginUserUseCase",
    LoginAdminUseCase: "LoginAdminUseCase",
    LoginGoogleUseCase: "LoginGoogleUseCase",
    LoginFacebookUseCase: "LoginFacebookUseCase",
    CompleteSocialProfileUseCase: "CompleteSocialProfileUseCase",
    LogoutUseCase: "LogoutUseCase",
    SignupViewerUseCase: "SignupViewerUseCase",
    SignupPlayerUseCase: "SignupPlayerUseCase",
    SignupManagerUseCase: "SignupManagerUseCase",
    SignupUmpireUseCase: "SignupUmpireUseCase",
    RefreshTokenUseCase: "RefreshTokenUseCase",
    ForgotPasswordUseCase: "ForgotPasswordUseCase",
    VerifyOtpUseCase: "VerifyOtpUseCase",
    ResendOtpUseCase: "ResendOtpUseCase",
    ResetPasswordUseCase: "ResetPasswordUseCase",
}

const AdminUsecaseTokens = {
    // --- Admin User Management ---
    GetAllManagersUseCase: "GetAllManagersUseCase",
    GetAllPlayersUseCase: "GetAllPlayersUseCase",
    GetAllViewersUseCase: "GetAllViewersUseCase",
    GetManagerDetailsUseCase: "GetManagerDetailsUseCase",
    GetPlayerDetailsUseCase: "GetPlayerDetailsUseCase",
    GetViewerDetailsUseCase: "GetViewerDetailsUseCase",

    // Admin User Status Operations
    ChangeUserStatusUseCase: "ChangeUserStatusUseCase",
    ChangeBlockUserStatusUseCase: "ChangeBlockUserStatusUseCase",
    GetUsersByRoleUseCase: "GetUsersByRoleUseCase",

    // --- Admin Transactions ---
    GetAdminTransactionsUseCase: "GetAdminTransactionsUseCase",
    GetTransactionDetailsUseCase: "GetTransactionDetailsUseCase",

    // --- Admin Tournament & Team ---
    GetAllTeamsUseCase: "GetAllTeamsUseCase",
    GetTeamDetailsUseCase: "GetTeamDetailsUseCase",
    GetAllTournamentsUseCase: "GetAllTournamentsUseCase",
    GetTournamentDetailsUseCase: "GetTournamentDetailsUseCase",
    ChangeTeamStatusUseCase: "ChangeTeamStatusUseCase",
    ChangeTeamDetailStatusUseCase: "ChangeTeamDetailStatusUseCase",
    ChangeTournamentStatusUseCase: "ChangeTournamentStatusUseCase",
    ChangeTournamentDetailStatusUseCase: "ChangeTournamentDetailStatusUseCase",

    // --- Admin Plans ---
    GetPlansUseCase: "GetPlansUseCase",
    CreatePlanUseCase: "CreatePlanUseCase",
    DeletePlanUseCase: "DeletePlanUseCase",
    UpdatePlanUseCase: "UpdatePlanUseCase",

    // --- Admin Dashboard ---
    GetDashboardStatsUseCase: "GetDashboardStatsUseCase",
    BulkUserSignup: "BulkUserSignup",
}


const ManagerUsecaseTokens = {
    AddNewTeamUseCase: "AddNewTeamUseCase",
    CreateChatForTeamUseCase: "CreateChatForTeamUseCase",
    GetManagerFinancialsUseCase: "GetManagerFinancialsUseCase",
    MatchDetailsService: "MatchDetailsService",
    MatchScoreService: "MatchScoreService",
    SaveMatchData: "SaveMatchData",
    GetLiveScoreUseCase: "GetLiveScoreUseCase",
    EndMatchUseCase: "EndMatchUseCase",
    GetManagerProfileUsecase: "GetManagerProfileUsecase",
    UpdateManagerProfile: "UpdateManagerProfile",

    // --- team ---
    TeamSetupService: "TeamSetupService",
    EditTeamUsecase: "EditTeamUsecase",
    DeleteTeamUsecase: "DeleteTeamUsecase",
    GetTeamsUsecase: "GetTeamsUsecase",
    GetmyTeamsDetailsUsecase: "GetmyTeamsDetailsUsecase",
    ChangeStatusUsecase: "ChangeStatusUsecase",
    ApprovetoTeamUsecase: "ApprovetoTeamUsecase",
    RejectfromTeamUsecase: "RejectfromTeamUsecase",
    SwapPlayersUsecase: "SwapPlayersUsecase",
    RemovePlayersUsecase: "RemovePlayersUsecase",
    GetAvilablePlayersService: "GetAvilablePlayersService",
    AddnewPlayerUsecase: "AddnewPlayerUsecase",

    // --- Tournament ---
    GetMyTournamentsUsecase: 'GetMyTournamentsUsecase',
    GetAvailableUmpires: 'GetAvailableUmpires',
    GetExploreTournamentsUsecase: 'GetExploreTournamentsUsecase',
    AddTournamentsUsecase: 'AddTournamentsUsecase',
    EditTournamentsUsecase: 'EditTournamentsUsecase',
    CancelTournamentsUsecase: 'CancelTournamentsUsecase',
    TournamentsDetailsUsecase: 'TournamentsDetailsUsecase',
    EntryFeePaymentUsecase: 'EntryFeePaymentUsecase',
    UpdateTournamenTeamUsecase: 'UpdateTournamenTeamUsecase',
    TournamentTeamsUsecase: 'TournamentTeamsUsecase',
    GetFixturesUsecase: 'GetFixturesUsecase',
    CreateFixturesUsecase: 'CreateFixturesUsecase',
    CreateMatchesUsecase: 'CreateMatchesUsecase',
    GetMatchesUsecase: 'GetMatchesUsecase',
    GetTourLeaderboard: 'GetTourLeaderboard',

    GetDashboardAnalytics: 'GetDashboardAnalytics',
    UpdateUserDirectlyPlan: 'UpdateUserDirectlyPlan',
    GetMyTournamentMatchResult: 'GetMyTournamentMatchResult',
}

const MatchUsecaseTokens = {
    // --- Match Scoring Use Cases ---
    InitInningsUseCase: "InitInningsUseCase",
    AddRunsUseCase: "AddRunsUseCase",
    SetStrikerUseCase: "SetStrikerUseCase",
    SetNonStrikerUseCase: "SetNonStrikerUseCase",
    SetBowlerUseCase: "SetBowlerUseCase",
    AddWicketUseCase: "AddWicketUseCase",
    AddExtrasUseCase: "AddExtrasUseCase",
    UndoLastBallUseCase: "UndoLastBallUseCase",
    StartSuperOverUseCase: "StartSuperOverUseCase",
    EndOverUseCase: "EndOverUseCase",
    EndInningsUseCase: "EndInningsUseCase",
    AddPenaltyUseCase: "AddPenaltyUseCase",
    RetireBatsmanUseCase: "RetireBatsmanUseCase",
    StartMatchUseCase: "StartMatchUseCase",
    GetPointsTableUseCase: "GetPointsTableUseCase",
    EndMatchUseCase: "EndMatchUseCase",
    GetAllMatches: "GetAllMatches",
}

const PlayerUsecaseTokens = {
    GetChatsUseCase: 'GetChatsUseCase',
    SendMessageUseCase: 'SendMessageUseCase',
    GetMessagesUseCase: 'GetMessagesUseCase',
    UpdateMessageStatusUseCase: 'UpdateMessageStatusUseCase',
    GetPlayerNotificationsUseCase: 'GetPlayerNotificationsUseCase',
    GetUnreadCountUseCase: 'GetUnreadCountUseCase',
    GetPlayerProfile: 'GetPlayerProfile',
    UpdatePlayerProfile: 'UpdatePlayerProfile',
    UpdatePlayerFields: 'UpdatePlayerFields',
    GetPlayerJoinedTeamsUseCase: 'GetPlayerJoinedTeamsUseCase',
    GetPlayerTeamsUseCase: 'GetPlayerTeamsUseCase',
    JoinTeamUseCase: 'JoinTeamUseCase',
    PlayerLeaveTeamUseCase: 'PlayerLeaveTeamUseCase',
    GetMyTeamDetailsUseCase: 'GetMyTeamDetailsUseCase',
    UpdatePlayerInviteStatus: 'UpdatePlayerInviteStatus',
    GetPlayerTournaments: 'GetPlayerTournaments',
    GetPlayerTournamentDetails: 'GetPlayerTournamentDetails',
    FetchMatchesUseCase: 'FetchMatchesUseCase',
    GetPlayerTournamentMatches: 'GetPlayerTournamentMatches',
    GetTournamentPointsTable: 'GetTournamentPointsTable',
    GetTournamentStats: 'GetTournamentStats',
    GetPlayerStats: 'GetPlayerStats',
}

const ViewerUsecaseTokens = {
    GetViewerProfile: 'GetViewerProfile',
    UpdateViewerProfile: 'UpdateViewerProfile',
    GetLiveMatches: 'GetLiveMatches',
    GetMatchUpdates: 'GetMatchUpdates',
    GetLeaderBoardUsecase: 'GetLeaderBoardUsecase',
    GetViewerTournamentsUseCase: 'GetViewerTournamentsUseCase',
}

const UmpireUseCaseTokens = {
    GetUmpireProfileUsecase : 'GetUmpireProfileUsecase',
    UpdateUmpireProfile : 'UpdateUmpireProfile',
    GetUmpireAllMatches : 'GetUmpireAllMatches',
}

const SharedUseCaseTokens = {
    MarkNotificationRead : Symbol.for('MarkNotificationRead'),
    MarkAllNotificationRead : Symbol.for('MarkAllNotificationRead'),
    VerifyPaymentUseCase: "VerifyPaymentUseCase",
    UpdateUserPlanUseCase: "UpdateUserPlanUseCase",
    VerifyPasswordUseCase: "VerifyPasswordUseCase",
    UpdatePasswordUseCase: "UpdatePasswordUseCase",
    UpdatePrivacyUseCase: "UpdatePrivacyUseCase",
    GetPlansAndUserSubscription: "GetPlansAndUserSubscription",
    CreatePaymentSession: "CreatePaymentSession",
    SubscriptionService: "SubscriptionService",
    GetUserSubscriptionPlan: "GetUserSubscriptionPlan",
    SavePayoutMethodUseCase: "SavePayoutMethodUseCase",
    GetPayoutMethodsUseCase: "GetPayoutMethodsUseCase",
    DeletePayoutMethodUseCase: "DeletePayoutMethodUseCase",
    CreateWalletOrderUseCase: "CreateWalletOrderUseCase",
    VerifyWalletPaymentUseCase: "VerifyWalletPaymentUseCase",
    InitiateWithdrawalUseCase: "InitiateWithdrawalUseCase",
    HandleWebhookUseCase: "HandleWebhookUseCase",
    GetUserWalletUseCase : 'GetUserWalletUseCase',
}


export const DI_TOKENS = {
    ...ProviderTokens,
    ...RepositoryTokens,
    ...ServiceTokens,
    ...StategyTokens,
    ...AuthUsecaseTokens,
    ...AdminUsecaseTokens,
    ...ManagerUsecaseTokens,
    ...MatchUsecaseTokens,
    ...PlayerUsecaseTokens,
    ...ViewerUsecaseTokens,
    ...SharedUseCaseTokens,
    ...UmpireUseCaseTokens    
};
