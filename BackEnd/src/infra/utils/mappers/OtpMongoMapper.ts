import { OtpResponse } from "../../../domain/entities/Otp";

export class OtpMongoMapper {
    static toDomain(doc): OtpResponse {
        if (!doc) return null!;
        return {
            ...doc,
            _id: doc._id.toString(),
        };
    }
}
