import { PlayerProfileController } from 'presentation/http/controllers/player/ProfileController';
import { GetPlayerProfile } from 'app/usecases/player/GetPlayerProfile';
import { UpdatePlayerProfile } from 'app/usecases/player/UpdatePlayerProfile';
import { playerRepository } from '../shared/repositories';
import { imageKitfileProvider, logger } from '../shared/providers';
import { UpdatePlayerFields } from 'app/usecases/player/UpdateProfileFields';
import { playerServices } from '../shared/services';

// Use cases
const getPlayerProfileUC = new GetPlayerProfile(playerRepository, logger);
const updatePlayerProfileUC = new UpdatePlayerProfile(playerServices, imageKitfileProvider, logger);
const updatePlayerSportFieldUC = new UpdatePlayerFields(playerServices, logger);

// Controller
export const playerProfileController = new PlayerProfileController(
    getPlayerProfileUC,
    updatePlayerProfileUC,
    updatePlayerSportFieldUC,
    logger
);
