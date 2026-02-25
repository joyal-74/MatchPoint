import { injectable, inject } from "tsyringe";
import { Types } from "mongoose";
import { DI_TOKENS } from "../../domain/constants/Identifiers";
import { IPayoutRepository } from "../../app/repositories/interfaces/shared/IPayoutRepository";
import { IPayoutMappingRepository } from "../../app/repositories/interfaces/shared/IPayoutMappingRepository";
import { IPayoutProvider } from "../../app/providers/IPayoutProvider";
import { IEncryptionProvider } from "../../app/providers/IEncryptionProvider";
import { SavePayoutMethodPayload } from "../../domain/types/financialTypes";

@injectable()
export class PayoutMethodResolver {
    constructor(
        @inject(DI_TOKENS.PayoutRepository) private _payoutRepo: IPayoutRepository,
        @inject(DI_TOKENS.PayoutMappingRepository) private _mappingRepo: IPayoutMappingRepository,
        @inject(DI_TOKENS.PayoutProvider) private _payoutProvider: IPayoutProvider,
        @inject(DI_TOKENS.EncryptionProvider) private _encryption: IEncryptionProvider
    ) { }

    async resolve(userId: string, data: string | SavePayoutMethodPayload) {

        if (typeof data === 'string') {
            const method = await this._payoutRepo.findById(data);
            const mapping = await this._mappingRepo.findByInternalId(data);

            if (!method) console.error(`Debug: Method not found for ID ${data}`);
            if (!mapping) console.error(`Debug: Mapping not found for ID ${data}`);

            if (!method || !mapping) throw new Error("Payout method not found");

            return { method, externalId: mapping.externalFundAccountId };
        }

        const rawValue = data.type === 'upi' ? data.upiId : data.accountNumber;

        const externalAccount = await this._payoutProvider.registerFundAccount({
            userId,
            type: data.type === 'upi' ? 'vpa' : 'bank_account',
            details: data.type === 'upi'
                ? { address: data.upiId, name: data.name }
                : { accountNumber: data.accountNumber, ifsc: data.ifsc, name: data.name }
        });

        const encryptedDetail = this._encryption.encrypt(rawValue);
        const maskedDetail = this._maskDetail(rawValue, data.type);

        const newMethod = await this._payoutRepo.create({
            userId: new Types.ObjectId(userId),
            type: data.type,
            name: data.name,
            detail: maskedDetail,
            encryptedDetail: encryptedDetail,
            ifsc: data.type === 'bank' ? data.ifsc : undefined,
            isPrimary: false
        } as any);

        await this._mappingRepo.create({
            internalMethodId: new Types.ObjectId(newMethod._id as string),
            externalFundAccountId: externalAccount.id,
            provider: 'RAZORPAY'
        } as any);

        return {
            method: newMethod,
            externalId: externalAccount.id
        };
    }

    /**
     * Helper to mask sensitive strings for storage in the 'detail' field
     */
    private _maskDetail(val: string, type: 'bank' | 'upi'): string {
        if (type === 'upi') {
            const [user, domain] = val.split('@');
            return `${user.slice(0, 2)}***@${domain}`;
        }
        return `XXXXXX${val.slice(-4)}`;
    }
}
