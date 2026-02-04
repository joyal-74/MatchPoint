import { Model, HydratedDocument, UpdateQuery } from "mongoose";
import { IBaseRepository } from "../../../app/repositories/IBaseRepository.js";

export class MongoBaseRepository<TSchema, TResponse>
    implements IBaseRepository<TSchema, TResponse> {

    constructor(protected readonly model: Model<TSchema>) {}

    protected toResponse(doc: HydratedDocument<TSchema>): TResponse {
        return doc.toObject() as TResponse;
    }

    async findById(id: string): Promise<TResponse | null> {
        const doc = await this.model.findById(id).exec();
        return doc ? this.toResponse(doc) : null;
    }

    async findByEmail(email: string): Promise<TResponse | null> {
        const doc = await this.model.findOne({ email }).exec();
        return doc ? this.toResponse(doc) : null;
    }

    async findAll(filter: Record<string, unknown> = {}): Promise<TResponse[]> {
        const docs = await this.model.find(filter).exec();
        return docs.map((doc) => this.toResponse(doc));
    }

    async create(data: Partial<TSchema>): Promise<TResponse> {
        const created = await this.model.create(data);
        return this.toResponse(created);
    }

    async update(id: string, data: Partial<TSchema>): Promise<TResponse | null> {
        const updated = await this.model.findByIdAndUpdate(
            id,
            data as UpdateQuery<TSchema>,
            { new: true }
        ).exec();

        return updated ? this.toResponse(updated) : null;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.model.findByIdAndDelete(id).exec();
        return !!result;
    }
}
