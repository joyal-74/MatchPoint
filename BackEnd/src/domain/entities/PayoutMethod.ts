export class PayoutMethod {
  constructor(
    public readonly managerId: string,
    public readonly type: 'bank' | 'upi',
    public readonly name: string,
    public readonly detail: string,
    public readonly encryptedDetail: string,
    public readonly ifsc?: string,
    public readonly isPrimary: boolean = false
  ) {}
}
