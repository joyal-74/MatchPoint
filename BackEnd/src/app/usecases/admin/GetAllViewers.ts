import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { UsersResponseDTO } from "domain/dtos/User.dto";
import { UserRoles } from "domain/enums";

export class GetAllViewers {
    constructor(private userRepository: IUserRepository) { }

    async execute(): Promise<UsersResponseDTO[]> {

        const viewers = await this.userRepository.findAllViewers(UserRoles.Viewer);
        return viewers;
    }
}