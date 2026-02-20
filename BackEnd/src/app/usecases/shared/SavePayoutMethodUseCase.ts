import { inject, injectable } from "tsyringe";
import { IPayoutResponse } from "../../../domain/dtos/PayoutResponse.dto.js";
import { SavePayoutMethodPayload } from "../../../domain/types/financialTypes.js";
import { PayoutValidator } from "../../../domain/validators/PayoutValidator.js";
import { IEncryptionProvider } from "../../providers/IEncryptionProvider.js";
import { IPayoutRepository } from "../../repositories/interfaces/shared/IPayoutRepository.js";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { ISavePayoutMethodUseCase } from "../../repositories/interfaces/usecases/IFinancialUseCases.js";
import { IPayoutProvider } from "../../providers/IPayoutProvider.js";
import { IPayoutMappingRepository } from "../../repositories/interfaces/shared/IPayoutMappingRepository.js";

@injectable()
export class SavePayoutMethodUseCase implements ISavePayoutMethodUseCase {
    constructor(
       @inject(DI_TOKENS.PayoutRepository) private _payoutRepository: IPayoutRepository,
       @inject(DI_TOKENS.EncryptionProvider) private _encryptionProvider: IEncryptionProvider,
       @inject(DI_TOKENS.PayoutProvider) private _payoutProvider: IPayoutProvider,
        @inject(DI_TOKENS.PayoutMappingRepository) private _mappingRepo: IPayoutMappingRepository
    ) { }

    async execute(userId: string, payload: SavePayoutMethodPayload): Promise<IPayoutResponse> {
        // 1. Domain Validation
        if (payload.type === 'upi') {
            if (!PayoutValidator.isValidUPI(payload.upiId)) {
                throw new Error("Invalid UPI ID format");
            }
        } else if (payload.type === 'bank') {
            if (!PayoutValidator.isValidIFSC(payload.ifsc)) {
                throw new Error("Invalid IFSC Code");
            }
            if (!PayoutValidator.isValidAccountNumber(payload.accountNumber)) {
                throw new Error("Invalid Bank Account Number");
            }
        }

        // 2. Data Preparation
        const rawDetail = payload.type === 'bank' ? payload.accountNumber : payload.upiId;
        const encryptedData = this._encryptionProvider.encrypt(rawDetail);

        const maskedDetail = payload.type === 'bank'
            ? `•••• ${payload.accountNumber.slice(-4)}`
            : payload.upiId;

        const existingMethods = await this._payoutRepository.findByUser(userId);
        const shouldBePrimary = existingMethods.length === 0;


        const newMethod = await this._payoutRepository.create({
            userId: userId as any,
            type: payload.type,
            name: payload.name,
            detail: maskedDetail,
            encryptedDetail: encryptedData,
            ifsc: payload.type === 'bank' ? payload.ifsc : undefined,
            isPrimary: shouldBePrimary
        });

        const externalAccount = await this._payoutProvider.registerFundAccount({
            userId,
            type: payload.type === 'upi' ? 'vpa' : 'bank_account',
            details: payload.type === 'upi' 
                ? { address: payload.upiId, name: payload.name }
                : { accountNumber: payload.accountNumber, ifsc: payload.ifsc, name: payload.name }
        });

        await this._mappingRepo.create({
            internalMethodId: newMethod._id,
            externalFundAccountId: externalAccount.id,
            provider: 'RAZORPAY'
        } as any);

        return newMethod;
    }
}