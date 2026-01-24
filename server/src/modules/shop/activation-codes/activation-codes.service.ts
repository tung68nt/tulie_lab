import { IActivationCodeRepository } from './interfaces/activation-code.repository.interface';
import { ICourseRepository } from '../../lms/courses/interfaces/course.repository.interface';
import { IProgressRepository } from '../../lms/courses/interfaces/progress.repository.interface';
import { IProductRepository } from '../products/interfaces/product.repository.interface';
import { IOrderRepository } from '../payments/interfaces/order.repository.interface';
import { ActivationCodeStatus, OrderStatus } from '@prisma/client';
import crypto from 'crypto';

export class ActivationCodeService {
    constructor(
        private activationCodeRepository: IActivationCodeRepository,
        private courseRepository: ICourseRepository,
        private progressRepository: IProgressRepository,
        private productRepository: IProductRepository,
        private orderRepository: IOrderRepository
    ) { }

    async generateCodes(courseId: string | null, count: number, buyerId?: string, orderId?: string, productId?: string) {
        if (!courseId && !productId) throw new Error('Either courseId or productId must be provided');

        if (courseId) {
            const course = await this.courseRepository.findById(courseId);
            if (!course) throw new Error('Course not found');
        }

        if (productId) {
            const product = await this.productRepository.findById(productId);
            if (!product) throw new Error('Product not found');
        }

        const codes = [];
        for (let i = 0; i < count; i++) {
            const code = crypto.randomBytes(4).toString('hex').toUpperCase();
            const newCode = await this.activationCodeRepository.create({
                code,
                ...(courseId ? { course: { connect: { id: courseId } } } : {}),
                ...(productId ? { product: { connect: { id: productId } } } : {}),
                status: ActivationCodeStatus.ACTIVE,
                ...(buyerId ? { buyer: { connect: { id: buyerId } } } : {}),
                ...(orderId ? { order: { connect: { id: orderId } } } : {})
            });
            codes.push(newCode);
        }
        return codes;
    }

    async redeemCode(code: string, userId: string) {
        const activationCode = await this.activationCodeRepository.findByCode(code, { course: true, product: true });
        if (!activationCode) throw new Error('Invalid code');
        if (activationCode.status !== ActivationCodeStatus.ACTIVE) throw new Error('Code already used or expired');

        if (activationCode.courseId) {
            // Check if user is already enrolled
            const enrollment = await this.progressRepository.getEnrollment(userId, activationCode.courseId);
            if (enrollment) throw new Error('User already enrolled in this course');

            // Redemption logic
            await this.activationCodeRepository.update(activationCode.id, {
                status: ActivationCodeStatus.USED,
                redeemedBy: { connect: { id: userId } },
                redeemedAt: new Date()
            });

            await this.progressRepository.upsertProgress(userId, activationCode.courseId, {} as any);
            return { success: true, courseId: activationCode.courseId, type: 'COURSE' };
        } else if (activationCode.productId) {
            // Product redemption
            await this.activationCodeRepository.update(activationCode.id, {
                status: ActivationCodeStatus.USED,
                redeemedBy: { connect: { id: userId } },
                redeemedAt: new Date()
            });

            // Create a PAID order record to grant access
            const orderCode = `ACT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
            await this.orderRepository.create({
                code: orderCode,
                amount: 0,
                status: OrderStatus.PAID,
                paymentMethod: 'ACTIVATION_CODE',
                user: { connect: { id: userId } },
                items: {
                    create: [
                        {
                            productId: activationCode.productId,
                            price: 0,
                            metadata: { activationCode: activationCode.code }
                        }
                    ]
                }
            });

            return { success: true, productId: activationCode.productId, type: 'PRODUCT' };
        }

        throw new Error('Code is not linked to any course or product');
    }

    async listCodes(params: any) {
        return this.activationCodeRepository.findAll(params);
    }

    async getByOrderId(orderId: string) {
        return this.activationCodeRepository.findByOrderId(orderId);
    }

    async deleteCode(id: string) {
        return this.activationCodeRepository.delete(id);
    }
}
