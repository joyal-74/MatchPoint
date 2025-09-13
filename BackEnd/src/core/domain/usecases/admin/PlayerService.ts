import { sportProfileConfig } from "../../../../shared/config/sportsConfig";
import { Player } from "../../entities/Player";
import { IPlayerRepository } from "../../repositories/interfaces/IPlayerRepository";

export class PlayerService {
    constructor(private playerRepository: IPlayerRepository) {}

    async createPlayerProfile(userId: string, sport: string): Promise<Player> {
        const profileFields = sportProfileConfig[sport.toLowerCase()] || [];
        const profile = profileFields.map(field => ({ ...field, value: null }));

        const player: Player = {
            userId,
            sport,
            profile
        } as Player;

        return this.playerRepository.create(player);
    }
}
