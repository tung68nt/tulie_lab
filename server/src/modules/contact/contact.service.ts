import prisma from '../../config/prisma';

export const createSubmission = async (data: { name: string, email: string, phone?: string, message: string }) => {
    // 1. Save to DB
    const submission = await prisma.contactSubmission.create({
        data
    });

    // 2. Send email notification to Admin (non-blocking)
    try {
        const { emailService } = await import('../../services/email.service');
        emailService.sendAdminContactNotification(data);
    } catch (error) {
        console.log('Admin notification skipped (SMTP not configured)');
    }

    return submission;
};

export const getSubmissions = async (page: number = 1, limit: number = 10, search?: string) => {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
        ];
    }

    const [total, items] = await Promise.all([
        prisma.contactSubmission.count({ where }),
        prisma.contactSubmission.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        })
    ]);

    return {
        data: items,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

export const updateStatus = async (id: string, status: string) => {
    return prisma.contactSubmission.update({
        where: { id },
        data: { status }
    });
};

export const deleteSubmission = async (id: string) => {
    return prisma.contactSubmission.delete({
        where: { id }
    });
};
