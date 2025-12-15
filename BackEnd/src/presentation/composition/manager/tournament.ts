import { AddTournamentUseCase } from "app/usecases/manager/tournaments/AddTournament";
import { CancelTournamentUsecase } from "app/usecases/manager/tournaments/CancelTournament";
import { EditTournamentUseCase } from "app/usecases/manager/tournaments/EditTournament";
import { ExploreTournamentsUseCase } from "app/usecases/manager/tournaments/GetExploreTournaments";
import { GetMyTournamentsUseCase } from "app/usecases/manager/tournaments/GetMyTournaments";
import { GetRegisteredTeams } from "app/usecases/manager/tournaments/GetRegisteredTeams";
import { InitiateTournamentPayment } from "app/usecases/manager/tournaments/InitiateTournamentPayment";
import { GetTournamentDetails } from "app/usecases/manager/tournaments/TournamentDetails";
import { UpdateTournamentTeam } from "app/usecases/manager/tournaments/UpdateTournamentTeam";
import { TournamentController } from "presentation/http/controllers/manager/TournamentController";
import { RazorpayProvider } from "infra/providers/RazorpayProvider";
import { WalletProvider } from "infra/providers/WalletProvider";
import { WinstonLogger } from "infra/providers/WinstonLogger";
import { TournamentIdGenerator } from "infra/providers/IdGenerator";
import { imageKitfileProvider, walletRepository } from "presentation/composition/shared/providers";
import { fixturesRepository, leaderboardRepository, managerRepository, matchRepository, registrationRepository, tournamentRepository } from "presentation/composition/shared/repositories";
import { tournamentRegistrationServices } from "../shared/services";
import { GetTournamentFixtures } from "app/usecases/manager/tournaments/fixtures/GetTournamentFixtures";
import { CreateMatchesUseCase } from "app/usecases/manager/tournaments/matches/CreateMatchesUseCase";
import { CreateFixtureUseCase } from "app/usecases/manager/tournaments/fixtures/CreateTournamentFixtures";
import { GetTournamentMatches } from "app/usecases/manager/tournaments/matches/GetMatchesUseCase";
import { GetTourLeaderboard } from "app/usecases/manager/tournaments/GetLeaderboardUseCase";


const logger = new WinstonLogger();
const tournamentId = new TournamentIdGenerator();

const razorpayProvider = new RazorpayProvider(
    process.env.RAZOR_API_KEY!,
    process.env.RAZOR_API_SECRET!
);

const walletProvider = new WalletProvider(walletRepository, registrationRepository);

const getMyTournaments = new GetMyTournamentsUseCase(tournamentRepository, logger);
const getExploreTournaments = new ExploreTournamentsUseCase(tournamentRepository, logger);
const addTournament = new AddTournamentUseCase(tournamentRepository, tournamentId, managerRepository, imageKitfileProvider, logger);
const editTournament = new EditTournamentUseCase(tournamentRepository, imageKitfileProvider, logger);
const cancelTournament = new CancelTournamentUsecase(tournamentRepository, logger);
const fetchTournamentDetails = new GetTournamentDetails(tournamentRepository, logger);
const getRegisteredTeams = new GetRegisteredTeams(registrationRepository, logger);
const initiatePayment = new InitiateTournamentPayment(
    tournamentRepository,
    registrationRepository,
    logger,
    razorpayProvider,
    walletProvider,
    tournamentRegistrationServices
);
const updateTournamentTeam = new UpdateTournamentTeam(tournamentRepository, registrationRepository, logger);
const getFixtures = new GetTournamentFixtures(fixturesRepository, logger)
const createFixtures = new CreateFixtureUseCase(fixturesRepository, logger)
const createMatchesUC = new CreateMatchesUseCase(matchRepository, logger)
const getMatchesUC = new GetTournamentMatches(matchRepository, logger)
const getTourLeaderBoardUC = new GetTourLeaderboard(leaderboardRepository)

export const tournamentManagementController = new TournamentController(
    getMyTournaments,
    getExploreTournaments,
    addTournament,
    editTournament,
    cancelTournament,
    fetchTournamentDetails,
    initiatePayment,
    updateTournamentTeam,
    getRegisteredTeams,
    getFixtures,
    createFixtures,
    createMatchesUC,
    getMatchesUC,
    getTourLeaderBoardUC,
    logger
);