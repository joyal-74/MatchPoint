import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { IUserRepository } from "../../../repositories/interfaces/shared/IUserRepository";

@injectable()
export class GetAvailableUmpires {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepo: IUserRepository
    ) { }

    async execute(limit: number = 10, page: number = 1) {
        const result = await this._userRepo.findAllUmpires({ limit, page });

        return result.users.map(u => ({
            _id: u._id,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            profileImage: u.profileImage,
            phone: u.phone
        }));
    }
}
