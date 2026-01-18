import { User, Prisma } from '@prisma/client';
import { IBaseRepository } from '../../../../core/interfaces/repository.interface';

export interface IUserRepository extends IBaseRepository<User, Prisma.UserCreateInput, Prisma.UserUpdateInput> {
    findByEmail(email: string, include?: Prisma.UserInclude): Promise<User | null>;
    findById(id: string, include?: Prisma.UserInclude): Promise<User | null>;
    findMany(options: any): Promise<any[]>;
    count(where?: Prisma.UserWhereInput): Promise<number>;
    groupByRole(): Promise<any[]>;
}
