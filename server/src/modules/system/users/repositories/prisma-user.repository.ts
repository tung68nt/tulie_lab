import { User, Prisma } from '@prisma/client';
import prisma from '../../../../config/prisma';
import { IUserRepository } from '../interfaces/user.repository.interface';

export class PrismaUserRepository implements IUserRepository {
    async create(data: Prisma.UserCreateInput): Promise<User> {
        return prisma.user.create({ data, include: { profile: true } });
    }

    async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return prisma.user.update({ where: { id }, data, include: { profile: true } });
    }

    async delete(id: string): Promise<User> {
        return prisma.user.delete({ where: { id } });
    }

    async findById(id: string, include?: Prisma.UserInclude): Promise<User | null> {
        return prisma.user.findUnique({ where: { id }, include: include || { profile: true } });
    }

    async findByEmail(email: string, include?: Prisma.UserInclude): Promise<User | null> {
        return prisma.user.findUnique({ where: { email }, include: include || { profile: true } });
    }

    async findAll(params: any): Promise<{ data: User[]; meta: any }> {
        const users = await prisma.user.findMany({ include: { profile: true } });
        return { data: users, meta: { total: users.length } };
    }

    async findMany(options: any): Promise<any[]> {
        return prisma.user.findMany(options);
    }

    async count(where?: Prisma.UserWhereInput): Promise<number> {
        return prisma.user.count({ where: (where || undefined) as any });
    }

    async groupByRole(): Promise<any[]> {
        return prisma.user.groupBy({
            by: ['role'],
            _count: { _all: true }
        }) as any;
    }
}
