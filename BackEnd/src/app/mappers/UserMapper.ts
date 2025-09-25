import { UserRegister, UserResponse } from "domain/entities/User";
import { UserRegisterResponseDTO, UserResponseDTO } from "domain/dtos/User.dto";

export class UserMapper {
    static toUserDTO(user: UserResponse): UserResponseDTO {
        return {
            _id: user._id,
            userId: user.userId,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            role: user.role,
            gender: user.gender,
            phone: user.phone,
            wallet: user.wallet,
            logo: user.logo,
            sport: user.sport,
        };
    }

    static toUserRegisterDTO(user: UserRegister & { _id: string }): UserRegisterResponseDTO {
        return {
            _id: user._id,
            userId: user.userId,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
        };
    }
}
