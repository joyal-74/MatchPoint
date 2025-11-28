import { UserDocument } from "infra/databases/mongo/models/UserModel";
import { UserResponse } from "domain/entities/User";

export class UserMapper {
    static toResponse(doc: UserDocument): UserResponse {
        return {
            _id: doc._id.toString(),
            userId: doc.userId,
            email: doc.email,
            profileImage: doc.profileImage,
            role: doc.role,
            firstName: doc.firstName,
            lastName: doc.lastName,
            username: doc.username,
            gender: doc.gender,
            phone: doc.phone,
            password: doc.password,
            authProvider: doc.authProvider,
            bio: doc.bio,
            sport : doc.sport,
            settings: doc.settings,
            wallet: doc.wallet,
            refreshToken: doc.refreshToken,
            isActive: doc.isActive,
            isVerified: doc.isVerified,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            subscription: doc.subscription,
        };
    }
}
