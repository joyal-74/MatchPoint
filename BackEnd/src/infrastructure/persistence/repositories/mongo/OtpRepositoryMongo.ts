import { IOtpRepository } from "@core/domain/repositories/interfaces/IOtpRepository";
import OTPModel from "@infra/persistence/database/mongo/models/OTPModel";
import type { PersistedOtp } from "@shared/types/Types";

export class OtpRepositoryMongo implements IOtpRepository {
    async saveOtp(userId: string, otp: string): Promise<PersistedOtp> {

        const created = await OTPModel.create({
            userId,
            code: otp,
            createdAt: new Date(),
        });
        return created.toObject();
    }

    async deleteOtp(userId: string): Promise<void> {
        await OTPModel.deleteMany({ userId });
    }


    async findOtp(userId: string): Promise<PersistedOtp | null> {
        const otpDoc = await OTPModel.findOne({ userId }).lean<PersistedOtp>();
        return otpDoc || null;
    }
}