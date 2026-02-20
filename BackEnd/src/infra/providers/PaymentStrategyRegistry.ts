import { injectable, injectAll } from "tsyringe";
import { IPaymentStrategy } from "../../app/repositories/interfaces/shared/IPaymentStrategy.js"; 
import { DI_TOKENS } from "../../domain/constants/Identifiers.js";

@injectable()
export class PaymentStrategyRegistry {
    private strategies: Map<string, IPaymentStrategy> = new Map();
    
    constructor(@injectAll(DI_TOKENS.PaymentStrategy) strategies: IPaymentStrategy[]) {
        strategies.forEach(s => this.strategies.set(s.type, s));
    }

    getStrategy(type: string): IPaymentStrategy {
        const strategy = this.strategies.get(type);
        if (!strategy) throw new Error(`No payment strategy found for: ${type}`);
        return strategy;
    }
}