import { container } from ".";
import { DI_TOKENS } from "domain/constants/Identifiers";

//  Services 
import { UserManagementService } from "../services/UserManagementService";
import { MatchScoreService } from "../services/MatchStatsService";
import { TeamSetupService } from "../services/TeamSetupServices";
import { PlayerService } from "../services/PlayerService";
import { LogoutService } from "../services/LogoutService";
import { GoogleAuthService } from "../services/GoogleAuthServices";
import { FacebookServices } from "../services/FacebookServices";
import { LiveStreamService } from "../services/LiveStreamService";
import { TransactionService } from "../services/TransactionService";
import { SubscriptionPaymentService } from "../services/SubscriptionService";
import { MatchPlayerServices } from "../services/MatchPlayerServices";
import { GetAvailablePlayersService } from "../services/GetAvailablePlayersService";
import { TournamentRegistrationValidator } from "../services/TournamentRegistrationValidator";
import { PlayerTeamServices } from "../services/PlayerTeamServices";
import { UserServices } from "../services/UserServices";
import { UserAuthServices } from "../services/UserAuthServices";
import { GetPlansAndUserSubscription } from "../services/GetPlansAndUserSubscription";
import { StartTournament } from "infra/services/StartTournament";
import { TournamentRefundService } from "infra/services/TournamentRefundService";

// registrations
container.register(DI_TOKENS.UserManagementService, { useClass: UserManagementService });
container.register(DI_TOKENS.MatchScoreService, { useClass: MatchScoreService });
container.register(DI_TOKENS.MatchPlayerServices, { useClass: MatchPlayerServices });
container.register(DI_TOKENS.TeamSetupService, { useClass: TeamSetupService });
container.register(DI_TOKENS.GetAvailablePlayersService, { useClass: GetAvailablePlayersService });
container.register(DI_TOKENS.TournamentRegistrationValidator, { useClass: TournamentRegistrationValidator });
container.register(DI_TOKENS.PlayerService, { useClass: PlayerService });
container.register(DI_TOKENS.LogoutService, { useClass: LogoutService });
container.register(DI_TOKENS.PlayerTeamServices, { useClass: PlayerTeamServices });
container.register(DI_TOKENS.UserServices, { useClass: UserServices });
container.register(DI_TOKENS.UserAuthServices, { useClass: UserAuthServices });
container.register(DI_TOKENS.GoogleAuthService, { useClass: GoogleAuthService });
container.register(DI_TOKENS.FacebookServices, { useClass: FacebookServices });
container.register(DI_TOKENS.LiveStreamService, { useClass: LiveStreamService });
container.register(DI_TOKENS.TransactionService, { useClass: TransactionService });
container.register(DI_TOKENS.SubscriptionPaymentService, { useClass: SubscriptionPaymentService });
container.register(DI_TOKENS.GetPlansAndUserSubscription, { useClass: GetPlansAndUserSubscription });
container.register(DI_TOKENS.StartTournament, { useClass: StartTournament });
container.register(DI_TOKENS.TournamentRefundService, { useClass: TournamentRefundService });