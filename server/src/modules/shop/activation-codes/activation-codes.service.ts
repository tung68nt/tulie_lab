import { IActivationCodeRepository } from './interfaces/activation-code.repository.interface';
import { ICourseRepository } from '../../lms/courses/interfaces/course.repository.interface';
import { IProgressRepository } from '../../lms/courses/interfaces/progress.repository.interface';
import { ActivationCodeStatus } from '@prisma/client';
import crypto from 'crypto';

export class ActivationCodeService {
    constructor(
        private activationCodeRepository: IActivationCodeRepository,
        private courseRepository: ICourseRepository,
        private progressRepository: IProgressRepository
    ) { }

    async generateCodes(courseId: string, count: number, buyerId?: string, orderId?: string) {
        const course = await this.courseRepository.findById(courseId);
        if (!course) throw new Error('Course not found');

        const codes = [];
        for (let i = 0; i < count; i++) {
            const code = crypto.randomBytes(4).toString('hex').toUpperCase();
            const newCode = await this.activationCodeRepository.create({
                code,
                course: { connect: { id: courseId } },
                status: ActivationCodeStatus.ACTIVE,
                ...(buyerId ? { buyer: { connect: { id: buyerId } } } : {}),
                ...(orderId ? { order: { connect: { id: orderId } } } : {})
            });
            codes.push(newCode);
        }
        return codes;
    }

    async redeemCode(code: string, userId: string) {
        const activationCode = await this.activationCodeRepository.findByCode(code);
        if (!activationCode) throw new Error('Invalid code');
        if (activationCode.status !== ActivationCodeStatus.ACTIVE) throw new Error('Code already used or expired');

        // Check if user is already enrolled
        const enrollment = await this.progressRepository.getEnrollment(userId, activationCode.courseId);
        if (enrollment) throw new Error('User already enrolled in this course');

        // Redemption logic
        await this.activationCodeRepository.update(activationCode.id, {
            status: ActivationCodeStatus.USED,
            redeemedBy: { connect: { id: userId } },
            redeemedAt: new Date()
        });

        // Enroll user (simplified enrollment by creating progress or enrollment entry)
        // Note: PrismaProgressRepository.upsertProgress usually expects progress state. 
        // We'll use a direct prisma call for enrollment if needed, or update repo.
        // For now, let's assume we need to give some progress.
        await this.progressRepository.upsertProgress(userId, activationCode.courseId, {} as any);

        return { success: true, courseId: activationCode.courseId };
    }

    async listCodes(params: any) {
        return this.activationCodeRepository.findAll(params);
    }

    async getByOrderId(orderId: string) {
        return this.activationCodeRepository.findByOrderId(orderId);
    }
}
