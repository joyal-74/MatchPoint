import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { BadRequestError } from "domain/errors";

export class LogoutUser {
    constructor(
        private userRepository: IUserRepository,
    ) { }

    async execute(userId: string): Promise<{ success: boolean; message: string }> {

        const user = await this.userRepository.findById(userId);
        if (!user) throw new BadRequestError("User not found");

        await this.userRepository.update(userId, { refreshToken: null });

        return { success: true, message: "Logout successful" };
    }
}
