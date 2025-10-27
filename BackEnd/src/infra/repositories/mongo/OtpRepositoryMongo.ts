import { IOtpRepository } from "app/repositories/interfaces/shared/IOtpRepository";
import { OtpResponse } from "domain/entities/Otp";
import OTPModel from "infra/databases/mongo/models/OtpModel";


export class OtpRepositoryMongo implements IOtpRepository {

    async findOtpById(id: string): Promise<OtpResponse | null> {
        return OTPModel.findById(id).lean<OtpResponse>().exec();
    }

    async findOtpByEmail(email: string): Promise<OtpResponse | null> {
        return OTPModel.findOne({ email }).lean<OtpResponse>().exec();
    }

    async saveOtp(userId: string, email : string, otp: string): Promise<OtpResponse> {
        const created = await OTPModel.create({
            userId,
            email,
            otp,
        });
        return { ...created.toObject(), _id: created._id.toString() };
    }

    async deleteOtp(userId: string): Promise<void> {
        await OTPModel.deleteMany({ userId }).exec();
    }

}