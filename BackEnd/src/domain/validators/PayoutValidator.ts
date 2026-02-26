export class PayoutValidator {
    static isValidUPI(upi: string): boolean {
        return /^[\w.-]+@[\w.-]+$/.test(upi);
    }

    static isValidIFSC(ifsc: string): boolean {
        return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
    }

    static isValidAccountNumber(acc: string): boolean {
        return /^\d{9,18}$/.test(acc);
    }
}
