import { PlayerProfileResponse } from "domain/dtos/Player.dto";

export class PlayerMongoMapper {
    static toPlayerProfileResponse(playerDoc): PlayerProfileResponse {
        const user = playerDoc.userId;

        return {
            _id: user._id.toString(),
            userId: user.userId,
            email: user.email,
            phone: user.phone,
            bio: user.bio,
            wallet: user.wallet,
            profileImage: user.profileImage,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            gender: user.gender,
            sport: playerDoc.sport,
            profile: playerDoc.profile,
        };
    }
}
