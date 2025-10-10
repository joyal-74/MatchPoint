import type { LoginUser } from "../../types/User";

export class UserMapper {
    static toLoginResponseDTO(user: LoginUser): LoginUser {
        return {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profileImage: user.profileImage,
            role: user.role,
            wallet: user.wallet
        };
    }
}