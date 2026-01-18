import { ActivationCode, Prisma } from '@prisma/client';
import { IBaseRepository } from '../../../../core/interfaces/repository.interface';

export interface IActivationCodeRepository extends IBaseRepository<ActivationCode, Prisma.ActivationCodeCreateInput, Prisma.ActivationCodeUpdateInput> {
    findByCode(code: string, include?: Prisma.ActivationCodeInclude): Promise<ActivationCode | null>;
    findByOrderId(orderId: string): Promise<ActivationCode[]>;
}
