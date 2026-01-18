import { ContactSubmission, Prisma } from '@prisma/client';
import { IBaseRepository } from '../../../../core/interfaces/repository.interface';

export interface IContactRepository extends IBaseRepository<ContactSubmission, Prisma.ContactSubmissionCreateInput, Prisma.ContactSubmissionUpdateInput> {
}
