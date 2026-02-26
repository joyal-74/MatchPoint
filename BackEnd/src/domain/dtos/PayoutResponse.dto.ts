export interface IPayoutResponse {
    _id: string;
    userId: string;
    type: 'bank' | 'upi';
    name: string;
    detail: string; 
    ifsc?: string;
    isPrimary: boolean;
}
