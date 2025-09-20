import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { UserResponseDTO } from "domain/dtos/User.dto";
import { NotFoundError } from "domain/errors";

export class GetViewerProfile {
    constructor(
        private userRepo: IUserRepository,
    ) { }

    async execute(id: string): Promise<UserResponseDTO> {
        const viewer = await this.userRepo.findById(id);
        if (!viewer) {
            throw new NotFoundError("Viewer account not found");
        }

        return viewer;
    }
}