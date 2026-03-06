import { prisma } from "../../../config/prisma";
import { storageService } from "../../../services/storage.service";
import { Prisma } from "@prisma/client";

export const getAdminEbooks = async (params: { keyword?: string; page: number; limit: number }) => {
    const { keyword, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: any = keyword ? {
        OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { slug: { contains: keyword, mode: 'insensitive' } },
        ]
    } : {};

    const [total, ebooks] = await Promise.all([
        prisma.ebook.count({ where }),
        prisma.ebook.findMany({
            where,
            include: {
                product: {
                    select: {
                        id: true,
                        title: true,
                        price: true
                    }
                }
            },
            orderBy: { updatedAt: 'desc' },
            skip,
            take: limit
        })
    ]);

    return { total, page, limit, data: ebooks };
};

export const getAdminEbookById = async (id: string) => {
    return prisma.ebook.findUnique({
        where: { id },
        include: {
            product: true
        }
    });
};

export const createEbook = async (data: any) => {
    // Generate slug from title if not provided
    if (!data.slug && data.title) {
        data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        // Check if slug exists
        const existing = await prisma.ebook.findUnique({ where: { slug: data.slug } });
        if (existing) {
            data.slug = `${data.slug}-${Math.random().toString(36).substring(2, 6)}`;
        }
    }

    return prisma.ebook.create({
        data
    });
};

export const updateEbook = async (id: string, data: any) => {
    return prisma.ebook.update({
        where: { id },
        data
    });
};

export const deleteEbook = async (id: string) => {
    return prisma.ebook.delete({
        where: { id }
    });
};

export const getEbookBySlug = async (slug: string) => {
    return prisma.ebook.findUnique({
        where: { slug },
        select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            cover: true,
            totalPages: true,
            previewPages: true,
            price: true,
            productId: true
        }
    });
};

export const checkAndGetPresignedUrl = async (ebookId: string, userId: string) => {
    // 1. Check direct access in EbookAccess
    const directAccess = await prisma.ebookAccess.findUnique({
        where: {
            userId_ebookId: { userId, ebookId }
        }
    });

    let hasAccess = !!directAccess;

    // 2. Check if user is Admin (optional, usually Admins have access to everything)
    if (!hasAccess) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });
        if (user?.role === 'ADMIN') {
            hasAccess = true;
        }
    }

    // 3. (Optional) Check membership access if applicable
    // This could be added later if ebooks are part of a subscription

    if (!hasAccess) {
        return { hasAccess: false };
    }

    // Get ebook to find the S3 key
    const ebook = await prisma.ebook.findUnique({
        where: { id: ebookId },
        select: { pdfKey: true }
    });

    if (!ebook || !ebook.pdfKey) {
        throw new Error("Không tìm thấy tệp Ebook.");
    }

    // Generate presigned URL (30 minutes)
    const presignedUrl = await storageService.getSignedUrl(ebook.pdfKey, 1800);

    return {
        hasAccess: true,
        presignedUrl
    };
};
