import prisma from '../../config/prisma';

export const listInstructors = async () => {
    return prisma.instructor.findMany({
        orderBy: { createdAt: 'desc' }
    });
};

export const getInstructor = async (id: string) => {
    return prisma.instructor.findUnique({
        where: { id }
    });
};

export const createInstructor = async (data: any) => {
    // Remove experiences if passed, as it's no longer in schema
    const { experiences, ...rest } = data;
    return prisma.instructor.create({
        data: rest
    });
};

export const updateInstructor = async (id: string, data: any) => {
    const { experiences, ...rest } = data;
    return prisma.instructor.update({
        where: { id },
        data: rest
    });
};

export const deleteInstructor = async (id: string) => {
    return prisma.instructor.delete({
        where: { id }
    });
};
