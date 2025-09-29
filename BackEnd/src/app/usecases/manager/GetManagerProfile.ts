import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { ManagerResponseDTO } from "domain/dtos/Manager.dto";
import { NotFoundError } from "domain/errors";

export class GetManagerProfile {
    constructor(
        private _userRepo: IUserRepository,
    ) { }

    async execute(id: string): Promise<ManagerResponseDTO> {
        const manager = await this._userRepo.findById(id);
        if (!manager) {
            throw new NotFoundError("Manager account not found");
        }

        return manager;
    } 
}