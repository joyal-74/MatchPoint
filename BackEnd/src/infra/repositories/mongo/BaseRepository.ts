import { Model, HydratedDocument, UpdateQuery } from "mongoose";
import { IBaseRepository } from "../../../app/repositories/IBaseRepository";

export class BaseRepository<TSchema, TResponse>
    implements IBaseRepository<TSchema, TResponse> {

    constructor(protected _model: Model<TSchema>) {}

    protected toResponse(doc: HydratedDocument<TSchema>): TResponse {
        return doc.toObject() as TResponse;
    }

    async findById(id: string): Promise<TResponse | null> {
        const doc = await this._model.findById(id).exec();
        return doc ? this.toResponse(doc) : null;
    }

    async findByEmail(email: string): Promise<TResponse | null> {
        const doc = await this._model.findOne({ email }).exec();
        return doc ? this.toResponse(doc) : null;
    }

    async findAll(filter: Record<string, unknown> = {}): Promise<TResponse[]> {
        const docs = await this._model.find(filter).exec();
        return docs.map((doc) => this.toResponse(doc));
    }

    async create(data: Partial<TSchema>): Promise<TResponse> {
        const created = await this._model.create(data);
        return this.toResponse(created);
    }

    async update(id: string, data: Partial<TSchema>): Promise<TResponse | null> {
        const updated = await this._model.findByIdAndUpdate(
            id,
            data as UpdateQuery<TSchema>,
            { new: true }
        ).exec();

        return updated ? this.toResponse(updated) : null;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this._model.findByIdAndDelete(id).exec();
        return !!result;
    }
}
