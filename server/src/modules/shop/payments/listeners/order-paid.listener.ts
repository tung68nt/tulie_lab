import { EventBus } from '../../../../core/event-bus';
import { IOrderRepository } from '../interfaces/order.repository.interface';
import { IActivationCodeRepository } from '../../activation-codes/interfaces/activation-code.repository.interface';
import { ICourseRepository } from '../../../lms/courses/interfaces/course.repository.interface';
import { IUserRepository } from '../../../system/users/interfaces/user.repository.interface';
import { FacebookService } from '../../../system/facebook/facebook.service';
import axios from 'axios';
import { env } from '../../../../config/env';

export class OrderPaidListener {
    constructor(
        private eventBus: EventBus,
        private orderRepository: IOrderRepository,
        private activationCodeRepository: IActivationCodeRepository,
        private courseRepository: ICourseRepository,
        private userRepository: IUserRepository,
        private facebookService: FacebookService
    ) {
        this.subscribe();
    }

    private subscribe() {
        this.eventBus.subscribe('ORDER_PAID', async (payload: any) => {
            console.log('[OrderPaidListener] Processing order:', payload.code);
            await this.handleOrderPaid(payload);
        });
    }

    private async handleOrderPaid(payload: any) {
        const { orderId } = payload;
        const order = await this.orderRepository.findById(orderId) as any; // Cast to access included relations (items)
        if (!order) {
            console.error(`[OrderPaidListener] Order not found: ${orderId}`);
            return;
        }

        // Fetch user with relations
        const user = await this.userRepository.findById(order.userId, {
            enrollments: { include: { course: true } },
            subscriptions: true
        });

        if (!user) {
            console.error(`[OrderPaidListener] User not found: ${order.userId}`);
            return;
        }

        // Define type with relations to avoid 'any'
        type UserWithRelations = typeof user & {
            enrollments: Array<{ courseId: string }>;
            subscriptions: Array<{ productId: string | null; endDate: Date; status: string }>;
        };
        const userWithRelations = user as UserWithRelations;

        for (const item of order.items) {
            // 1. Course Handling
            if (item.courseId) {
                // Check metadata for activation type (default to EMAIL/DIRECT if missing)
                const metadata = item.metadata as any || {};
                const activationType = metadata.activationType || 'EMAIL';

                if (activationType === 'CODE') {
                    // Generate Activation Code
                    const codeStr = Math.random().toString(36).substring(2, 12).toUpperCase();
                    await this.activationCodeRepository.create({
                        code: codeStr,
                        course: { connect: { id: item.courseId } },
                        order: { connect: { id: order.id } },
                        buyer: { connect: { id: order.userId } }
                    });
                    console.log(`[OrderPaidListener] Generated code ${codeStr} for order ${order.code}`);
                } else {
                    // Direct Enrollment
                    // Check if already enrolled to avoid unique constraint errors
                    const existingEnrollment = userWithRelations.enrollments?.find((e: any) => e.courseId === item.courseId);
                    if (!existingEnrollment) {
                        // We need an enrollment repo or use prisma directly? 
                        // Usually Service handles this. But here we are in a listener.
                        // Ideally we inject EnrollmentService but avoiding circular deps might be tricky.
                        // Let's rely on a direct repository call if possible or user update.
                        // Actually, standard way is likely:
                        await this.userRepository.update(user.id, {
                            enrollments: {
                                create: {
                                    courseId: item.courseId
                                }
                            }
                        });
                        console.log(`[OrderPaidListener] Enrolled user ${user.email} in course ${item.courseId}`);
                    }
                }
            }

            // 2. Product Handling (Subscriptions)
            if (item.productId && item.product) {
                if (item.product.type === 'SUBSCRIPTION') {
                    // Calculate end date based on product (e.g. 1 year)
                    const startDate = new Date();
                    const endDate = new Date(startDate);
                    endDate.setFullYear(endDate.getFullYear() + 1);

                    // Deactivate old active subscriptions first
                    await this.userRepository.update(user.id, {
                        subscriptions: {
                            updateMany: {
                                where: { status: 'ACTIVE' },
                                data: { status: 'EXPIRED' }
                            },
                        }
                    });

                    await this.userRepository.update(user.id, {
                        subscriptions: {
                            create: {
                                productId: item.productId,
                                startDate: startDate,
                                endDate: endDate,
                                status: 'ACTIVE'
                            }
                        }
                    });
                    console.log(`[OrderPaidListener] Created subscription for user ${user.email} and deactivated old ones.`);
                }
            }
        }

        // 3. Send Facebook CAPI Event
        try {
            await this.facebookService.sendConversionEvent(order, 'Purchase', {
                userAgent: payload.userAgent, // Should be passed in payload if available
                ip: payload.ip,
                sourceUrl: payload.sourceUrl
            });
        } catch (err) {
            console.error('[OrderPaidListener] Failed to send CAPI event:', err);
        }

        // 4. Push to CRM Webhook
        if (env.CRM_WEBHOOK_URL) {
            try {
                console.log(`[OrderPaidListener] Pushing order ${order.code} to CRM...`);
                await axios.post(env.CRM_WEBHOOK_URL, {
                    event: 'ORDER_PAID',
                    order: {
                        id: order.id,
                        code: order.code,
                        amount: Number(order.amount),
                        user: {
                            email: (user as any).email,
                            profile: (user as any).profile
                        },
                        items: order.items,
                        createdAt: order.createdAt
                    }
                }, {
                    headers: {
                        'x-academy-api-key': env.CRM_API_KEY || ''
                    },
                    timeout: 5000
                });
                console.log(`[OrderPaidListener] Successfully pushed to CRM`);
            } catch (err: any) {
                console.error('[OrderPaidListener] Failed to push to CRM:', err.message);
            }
        }
    }
}
