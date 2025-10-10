import { PlayerResponseDTO } from "domain/dtos/Player.dto";
import { UserLoginResponseDTO } from "domain/dtos/User.dto";


export class playerMapper {
    static toLoginResponseDTO(player: UserLoginResponseDTO): UserLoginResponseDTO {
        return {
            _id: player._id,
            firstName: player.firstName,
            lastName: player.lastName,
            email: player.email,
            role: player.role,
            wallet: player.wallet,
            profileImage: player.profileImage,
        };
    }

    static toProfileResponseDTO(player: PlayerResponseDTO): PlayerResponseDTO {
        return {
            _id: player._id,
            userId: player.userId,
            email: player.email,
            firstName: player.firstName,
            lastName: player.lastName,
            username: player.username,
            role: player.role,
            gender: player.gender,
            phone: player.phone || null,
            wallet: player.wallet,
            bio: player.bio,
            profileImage: player.profileImage,
            sport : player.sport
        };
    }
}
