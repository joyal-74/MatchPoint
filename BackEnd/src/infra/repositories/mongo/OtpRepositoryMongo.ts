import { IOtpRepository } from "../../../app/repositories/interfaces/shared/IOtpRepository.js";
import { OtpResponse } from "../../../domain/entities/Otp.js";
import OTPModel from "../../databases/mongo/models/OtpModel.js";
import { OtpMongoMapper } from "../../utils/mappers/OtpMongoMapper.js";


export class OtpRepositoryMongo implements IOtpRepository {

    async findOtpById(id: string): Promise<OtpResponse | null> {
        const doc = await OTPModel.findById(id).lean().exec();
        return OtpMongoMapper.toDomain(doc);
    }

    async findOtpByEmail(email: string): Promise<OtpResponse | null> {
        const doc = await OTPModel.findOne({ email }).lean().exec();
        return OtpMongoMapper.toDomain(doc);
    }

    async saveOtp(userId: string, email: string, otp: string): Promise<OtpResponse> {
        const created = await OTPModel.create({ userId, email, otp });
        return OtpMongoMapper.toDomain(created.toObject());
    }

    async deleteOtp(userId: string): Promise<void> {
        await OTPModel.deleteMany({ userId }).exec();
    }
}
