import { IBaseRepository } from "app/repositories/IBaseRepository";
import { Model, Document, UpdateQuery } from "mongoose";

export class MongoBaseRepository<TDocument extends Document, TResponse> implements IBaseRepository<TDocument, TResponse> {

    constructor(protected readonly model: Model<TDocument>) { }

    protected toResponse(doc: TDocument): TResponse {
        return doc.toObject() as unknown as TResponse;
    }

    async findById(id: string): Promise<TResponse | null> {
        const doc = await this.model.findById(id).lean<TDocument>().exec();
        return doc ? this.toResponse(doc) : null;
    }

    async findByEmail(email: string): Promise<TResponse | null> {
        const doc = await this.model.findOne({ email }).lean<TDocument>().exec();
        return doc ? this.toResponse(doc) : null;
    }

    async findAll(filter: Record<string, unknown> = {}): Promise<TResponse[]> {
        const docs = await this.model.find(filter).lean<TDocument[]>().exec();
        return docs.map((doc) => this.toResponse(doc));
    }

    async create(data: Partial<TDocument>): Promise<TResponse> {
        const created = await this.model.create(data);
        return this.toResponse(created.toObject() as TDocument);
    }

    async update(id: string, data: Partial<TDocument>): Promise<TResponse | null> {
        const updated = await this.model
            .findByIdAndUpdate(id, data as UpdateQuery<TDocument>, { new: true })
            .lean<TDocument>()
            .exec();

        return updated ? this.toResponse(updated) : null;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.model.findByIdAndDelete(id).exec();
        return !!result;
    }
}
