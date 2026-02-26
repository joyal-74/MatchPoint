import axios from 'axios';
import { IPayoutProvider, PayoutRequest, RegisterFundAccountRequest } from '../../app/providers/IPayoutProvider';
import { IConfigProvider } from '../../app/providers/IConfigProvider';
import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../domain/constants/Identifiers";

@injectable()
export class RazorpayXPayoutProvider implements IPayoutProvider {
    private readonly BASE_URL = 'https://api.razorpay.com/v1';

    constructor(
        @inject(DI_TOKENS.ConfigProvider) private _config: IConfigProvider
    ) { }

    private get _auth() {
        return {
            username: this._config.getRazorPayKey(),
            password: this._config.getRazorPaySecret()
        };
    }

    async registerFundAccount(data: RegisterFundAccountRequest) {
        const contactResponse = await axios.post(
            `${this.BASE_URL}/contacts`,
            {
                name: data.userId,
                type: "customer",
                reference_id: data.userId
            },
            { auth: this._auth }
        );

        const contactId = contactResponse.data.id;

        // 2. Create Fund Account
        const fundAccountPayload = data.type === 'vpa'
            ? {
                contact_id: contactId,
                account_type: "vpa",
                vpa: { address: data.details.address }
            }
            : {
                contact_id: contactId,
                account_type: "bank_account",
                bank_account: {
                    name: data.details.name,
                    ifsc: data.details.ifsc,
                    account_number: data.details.accountNumber
                }
            };

        const response = await axios.post(
            `${this.BASE_URL}/fund_accounts`,
            fundAccountPayload,
            { auth: this._auth }
        );

        return {
            id: response.data.id,
            status: response.data.active
        };
    }

    async sendMoney(data: PayoutRequest) {
        try {
            const accountNumber = this._config.getRazorpayXAccountNumber();
            const mode = data.type === 'upi' ? 'UPI' : 'IMPS';
            const response = await axios.post(
                `${this.BASE_URL}/payouts`,
                {
                    account_number: accountNumber,
                    fund_account_id: data.fundAccountId,
                    amount: data.amount * 100,
                    currency: "INR",
                    mode: mode,
                    purpose: "payout",
                    reference_id: data.referenceId,
                },
                { auth: this._auth }
            );
            return { payoutId: response.data.id, status: response.data.status };
        } catch (error: any) {
            if (error.response) {
                // THIS LOG IS THE KEY
                console.error("DEBUG RAZORPAY ERROR:", JSON.stringify(error.response.data, null, 2));
            }
            throw error;
        }
    }

    async getPayoutStatus(payoutId: string) {
        const response = await axios.get(
            `${this.BASE_URL}/payouts/${payoutId}`,
            { auth: this._auth }
        );
        return response.data.status;
    }
}
