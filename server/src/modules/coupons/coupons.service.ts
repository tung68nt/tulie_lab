import prisma from '../../config/prisma';
import { DiscountType } from '@prisma/client';

export const validateCoupon = async (code: string, cartAmount: number, userId?: string) => {
    const coupon = await prisma.coupon.findUnique({
        where: { code: code.toUpperCase() } // Case insensitive? Schema has unique code. Usually normalize to upper.
    });

    if (!coupon) {
        throw new Error('Mã giảm giá không tồn tại');
    }

    if (!coupon.isActive) {
        throw new Error('Mã giảm giá đã bị vô hiệu hóa');
    }

    const now = new Date();
    if (coupon.startDate && now < coupon.startDate) {
        throw new Error('Mã giảm giá chưa có hiệu lực');
    }

    if (coupon.endDate && now > coupon.endDate) {
        throw new Error('Mã giảm giá đã hết hạn');
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        throw new Error('Mã giảm giá đã hết lượt sử dụng');
    }

    if (coupon.minPurchase && cartAmount < coupon.minPurchase) {
        throw new Error(`Đơn hàng tối thiểu để áp dụng mã này là ${coupon.minPurchase.toLocaleString()}đ`);
    }

    if (userId && coupon.perUserLimit) {
        const userUsage = await prisma.couponUsage.count({
            where: { couponId: coupon.id, userId }
        });
        if (userUsage >= coupon.perUserLimit) {
            throw new Error('Bạn đã hết lượt sử dụng mã này');
        }
    }

    // Calculate discount preview
    const discountAmount = calculateDiscountAmount(cartAmount, coupon);

    return { ...coupon, discountAmount };
};

export const calculateDiscountAmount = (originalAmount: number, coupon: any) => {
    let discount = 0;
    if (coupon.discountType === DiscountType.PERCENT) {
        discount = Math.floor((originalAmount * coupon.discountValue) / 100);
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
        }
    } else {
        // FIXED
        discount = coupon.discountValue;
    }
    return Math.min(discount, originalAmount);
};

export const applyCoupon = async (orderId: string, code: string, userId: string) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId }
    });
    if (!order) throw new Error('Order not found');

    const validation = await validateCoupon(code, order.amount, userId);
    const discount = calculateDiscountAmount(order.amount, validation);

    // This function typically updates Order. But Order schema doesn't have couponId (yet).
    // Let's check Schema. Order has no explicit coupon relation.
    // It has `CouponUsage` model.
    // We should record usage upon successful PAYMENT, not just applying.
    // Applying usually just updates transaction amount or session.

    // For now, assuming this is called during checkout calculation or order creation.
    // Return discount info.
    return { discount, finalAmount: order.amount - discount, couponId: validation.id };
};

export const listCoupons = async (isAdmin = false) => {
    // Public only active? Admin all.
    const where = isAdmin ? {} : {
        isActive: true,
        OR: [
            { startDate: null },
            { startDate: { lte: new Date() } }
        ],
        AND: [
            { OR: [{ endDate: null }, { endDate: { gte: new Date() } }] }
        ]
    };

    return prisma.coupon.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
            _count: { select: { usages: true } }
        }
    });
};

export const getCoupon = async (id: string) => {
    return prisma.coupon.findUnique({
        where: { id },
        include: { _count: { select: { usages: true } } }
    });
};

export const createCoupon = async (data: any) => {
    // Normalize code
    data.code = data.code.toUpperCase();
    return prisma.coupon.create({ data });
};

export const updateCoupon = async (id: string, data: any) => {
    if (data.code) data.code = data.code.toUpperCase();
    return prisma.coupon.update({
        where: { id },
        data
    });
};

export const deleteCoupon = async (id: string) => {
    return prisma.coupon.delete({ where: { id } });
};

// Birthday Logic
import emailService from '../../services/email.service';

export const checkAndIssueBirthdayCoupon = async (userId: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.birthDate) return null;

    const today = new Date();
    const birthDate = new Date(user.birthDate);

    // Check if birthday is in current month
    if (today.getMonth() !== birthDate.getMonth()) return null;

    const year = today.getFullYear();
    // Unique code per year: HPBD-{USERID_PREFIX}-{YEAR}
    if (!user) return null;
    const userIdShort = (user!.id.split('-')[0] || '').toUpperCase();
    const personalizedCode = `HPBD-${userIdShort}-${year}`;

    // Check if usage exists OR coupon exists
    const existingCoupon = await prisma.coupon.findUnique({
        where: { code: personalizedCode }
    });

    if (existingCoupon) return existingCoupon;

    // Find a "Template" Birthday Coupon (created by Admin)
    const template = await prisma.coupon.findFirst({
        where: {
            forBirthday: true,
            isActive: true
        }
    });

    if (!template) return null;

    // Create personalized coupon based on template
    const newCoupon = await prisma.coupon.create({
        data: {
            code: personalizedCode,
            description: `Birthday Coupon for ${user.name || user.email}`,
            discountType: template.discountType,
            discountValue: template.discountValue,
            maxDiscount: template.maxDiscount,
            minPurchase: template.minPurchase,
            usageLimit: 1,
            perUserLimit: 1,
            isActive: true,
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
            forBirthday: true
        }
    });

    // Send Email
    const discountText = template.discountType === 'PERCENT'
        ? `${template.discountValue}%`
        : `${template.discountValue.toLocaleString()}đ`;

    await emailService.sendBirthdayCouponEmail(
        user.email,
        user.name || 'Bạn',
        personalizedCode,
        discountText
    );

    return newCoupon;
};
