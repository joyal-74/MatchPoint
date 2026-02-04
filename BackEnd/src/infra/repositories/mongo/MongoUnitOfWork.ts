import mongoose, { ClientSession } from 'mongoose';
import { IUnitOfWork } from '../../../app/repositories/interfaces/shared/IUnitOfWork.js';

export class MongoUnitOfWork implements IUnitOfWork {
    private session!: ClientSession;

    async begin(): Promise<void> {
        this.session = await mongoose.startSession();
        this.session.startTransaction();
    }

    async commit(): Promise<void> {
        await this.session.commitTransaction();
        this.session.endSession();
    }

    async rollback(): Promise<void> {
        await this.session.abortTransaction();
        this.session.endSession();
    }

    getContext(): unknown {
        return this.session;
    }
}
