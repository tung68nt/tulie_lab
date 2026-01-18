import { SystemSetting, Prisma } from '@prisma/client';

export interface ISettingRepository {
    findAll(): Promise<SystemSetting[]>;
    findByKey(key: string): Promise<SystemSetting | null>;
    upsert(key: string, value: any, type?: string, category?: string): Promise<SystemSetting>;
    updateMany(data: { key: string, value: any }[]): Promise<void>;
}
