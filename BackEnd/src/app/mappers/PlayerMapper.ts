import { PlayerProfileResponse } from "../../domain/dtos/Player.dto.js";
import { UserLoginResponseDTO } from "../../domain/dtos/User.dto.js";
import { PlayerResponse } from "../../domain/entities/Player.js";
import { User } from "../../domain/entities/User.js";
import { PlayerDetails } from "../usecases/admin/GetPlayerDetails.js";



export class PlayerMapper {
    static toLoginResponseDTO(player: UserLoginResponseDTO): UserLoginResponseDTO {
        return {
            _id: player._id,
            firstName: player.firstName,
            lastName: player.lastName,
            email: player.email,
            role: player.role,
            wallet: player.wallet,
            profileImage: player.profileImage,
            isActive : player.isActive,
            createdAt : player.createdAt
        };
    }

    static toProfileResponseDTO(player: PlayerProfileResponse): PlayerProfileResponse {
        return {
            _id: player._id,
            userId: player.userId,
            email: player.email,
            firstName: player.firstName,
            lastName: player.lastName,
            username: player.username,
            role: player.role,
            gender: player.gender,
            phone: player.phone,
            wallet: player.wallet,
            bio: player.bio,
            profileImage: player.profileImage,
            sport: player.sport,
            profile: player.profile
        };
    }

    static toPlayerDetailsDTO(player: PlayerResponse): PlayerDetails {
        const user = player.userId as unknown as User;

        const toStringOrNull = (value: unknown): string | null => {
            if (value === null || value === undefined) return null;
            return typeof value === 'string' ? value : String(value);
        };

        return {
            _id: player._id,
            fullName: `${user.firstName} ${user.lastName}`,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.isActive ? "Active" : "Blocked",
            subscription: user.subscription || "Free",
            joinedAt: user.createdAt.toLocaleDateString(),
            profileImage: user.profileImage || "",
            stats: {
                battingStyle: toStringOrNull(player.profile?.battingStyle),
                bowlingStyle: toStringOrNull(player.profile?.bowlingStyle),
                position: toStringOrNull(player.profile?.position),
            },
            isBlocked: !user.isActive,
        };
    }
}
