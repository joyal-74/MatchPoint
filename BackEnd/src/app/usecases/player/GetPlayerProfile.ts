import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { ManagerResponseDTO } from "domain/dtos/Manager.dto";
import { NotFoundError } from "domain/errors";

export class GetPlayerProfile {
    constructor(
        private userRepo: IUserRepository,
    ) { }

    async execute(id: string): Promise<ManagerResponseDTO> {
        const player = await this.userRepo.findById(id);
        if (!player) {
            throw new NotFoundError("Player account not found");
        }

        return player;
    }
}