export interface IBaseRepository<TDocument, TResponse> {
    findById(id: string): Promise<TResponse | null>;
    findByEmail(email: string): Promise<TResponse | null>;
    findAll(filter?: Record<string, unknown>): Promise<TResponse[]>;
    create(data: Partial<TDocument>): Promise<TResponse>;
    update(id: string, data: Partial<TDocument>): Promise<TResponse | null>;
    delete(id: string): Promise<boolean>;
}