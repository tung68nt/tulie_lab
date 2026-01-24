import { SystemSetting, Prisma } from '@prisma/client';
import prisma from '../../../../config/prisma';
import { ISettingRepository } from '../interfaces/setting.repository.interface';

export class PrismaSettingRepository implements ISettingRepository {
    async findAll(): Promise<SystemSetting[]> {
        return prisma.systemSetting.findMany();
    }

    async findByKey(key: string): Promise<SystemSetting | null> {
        return prisma.systemSetting.findUnique({ where: { key } });
    }

    async upsert(key: string, value: any, type: string = 'text'): Promise<SystemSetting> {
        return prisma.systemSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value, type }
        });
    }

    async updateMany(data: { key: string, value: any }[]): Promise<void> {
        await prisma.$transaction(
            data.map(item => prisma.systemSetting.upsert({
                where: { key: item.key },
                update: { value: item.value },
                create: { key: item.key, value: item.value, type: 'text' }
            }))
        );
    }
}
