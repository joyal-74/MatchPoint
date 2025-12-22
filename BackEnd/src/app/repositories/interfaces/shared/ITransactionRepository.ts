import { TransactionCheckDTO, TransactionCreateDTO } from "domain/dtos/Transaction.dto";

export interface ITransactionRepository {
    create(data: TransactionCreateDTO, ctx?: unknown): Promise<void>;
    exists(data: TransactionCheckDTO, ctx?: unknown): Promise<boolean>;
}