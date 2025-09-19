import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { ManagersResponseDTO } from "domain/dtos/Manager.dto";

export class GetAllManagers {
    constructor(private userRepository: IUserRepository) { }

    async execute(): Promise<ManagersResponseDTO[]> {

        const managers = await this.userRepository.findAllManagers("manager");
        return managers;
    }
}