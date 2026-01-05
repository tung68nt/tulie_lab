import prisma from '../../config/prisma';

export const listCategories = async () => {
    return prisma.category.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
        include: {
            _count: {
                select: { courses: true }
            }
        }
    });
};

export const getCategory = async (id: string) => {
    return prisma.category.findUnique({
        where: { id },
        include: { courses: true }
    });
};

export const createCategory = async (data: any) => {
    // Auto generate slug if not provided
    if (!data.slug && data.name) {
        data.slug = data.name.toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    }

    return prisma.category.create({
        data
    });
};

export const updateCategory = async (id: string, data: any) => {
    if (data.name && !data.slug) {
        data.slug = data.name.toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    }
    return prisma.category.update({
        where: { id },
        data
    });
};

export const deleteCategory = async (id: string) => {
    return prisma.category.delete({
        where: { id }
    });
};
