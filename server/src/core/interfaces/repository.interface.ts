export interface IBaseRepository<T, CreateInput = any, UpdateInput = any> {
    create(data: CreateInput): Promise<T>;
    update(id: string, data: UpdateInput): Promise<T>;
    delete(id: string): Promise<T>;
    findById(id: string): Promise<T | null>;
    findAll(params: any): Promise<{ data: T[]; meta: any }>;
}
