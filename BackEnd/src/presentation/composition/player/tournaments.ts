import { FetchTournamentsUseCase } from "app/usecases/player/fetchplayerTournaments";
import { TournamentsController } from "presentation/http/controllers/player/TournamentsController";
import { registrationRepository, teamRepository, tournamentRepository } from "../shared/repositories";
import { logger } from "../shared/providers";

const getplayerTournaments = new FetchTournamentsUseCase(tournamentRepository, registrationRepository, teamRepository, logger)

export const playerTournamentController = new TournamentsController(getplayerTournaments, logger);