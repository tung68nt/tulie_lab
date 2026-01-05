import prisma from '../../config/prisma';

export const listBundles = async (isAdmin = false, userId?: string) => {
    const bundles = await prisma.bundle.findMany({
        where: isAdmin ? {} : { isActive: true },
        include: {
            courses: {
                include: {
                    course: { select: { id: true, title: true, price: true, thumbnail: true, slug: true } }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    if (!userId) return bundles;

    // Calculate dynamic price if user is logged in (Upsell)
    const enrollments = await prisma.enrollment.findMany({
        where: { userId },
        select: { courseId: true }
    });
    const ownedCourseIds = new Set(enrollments.map(e => e.courseId));

    return bundles.map(bundle => {
        const ownedCourses = bundle.courses.filter(bc => ownedCourseIds.has(bc.courseId));
        if (ownedCourses.length === 0) return bundle;

        // Calculate value of owned courses
        const ownedValue = ownedCourses.reduce((sum, bc) => sum + bc.course.price, 0);

        // New price = Sale Price - Owned Value (clamped to 0)
        // Or specific logic: Maintain discount ratio?
        // Simple logic: Deduct owned value directly from sale price
        let dynamicPrice = bundle.salePrice - ownedValue;
        if (dynamicPrice < 0) dynamicPrice = 0;

        return {
            ...bundle,
            salePrice: dynamicPrice,
            originalPrice: bundle.originalPrice - ownedValue, // Adjust original too to show correct saving?
            isDynamicPrice: true,
            ownedCoursesCount: ownedCourses.length
        };
    });
};

export const getBundle = async (id: string) => {
    return prisma.bundle.findUnique({
        where: { id },
        include: {
            courses: {
                include: {
                    course: { select: { id: true, title: true, price: true, thumbnail: true, slug: true } }
                }
            }
        }
    });
};

export const createBundle = async (data: any) => {
    const { courseIds, ...bundleData } = data;

    // Generate slug
    if (!bundleData.slug && bundleData.name) {
        bundleData.slug = bundleData.name.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
    }

    // Ensure unique slug
    let uniqueSlug = bundleData.slug;
    let counter = 1;
    while (await prisma.bundle.findUnique({ where: { slug: uniqueSlug }, select: { id: true } })) {
        uniqueSlug = `${bundleData.slug}-${counter}`;
        counter++;
    }
    bundleData.slug = uniqueSlug;

    return prisma.bundle.create({
        data: {
            ...bundleData,
            courses: {
                create: courseIds && Array.isArray(courseIds)
                    ? courseIds.map((id: string) => ({ courseId: id }))
                    : []
            }
        },
        include: {
            courses: { include: { course: true } }
        }
    });
};

export const updateBundle = async (id: string, data: any) => {
    const { courseIds, ...bundleData } = data;

    if (bundleData.name && !bundleData.slug) {
        // Optionally update slug if name changes? Better keep old slug for SEO unless explicit.
        // Skip slug auto-update.
    }

    // Transaction to update relations
    if (courseIds) {
        // Delete all existing relations
        await prisma.bundleCourse.deleteMany({
            where: { bundleId: id }
        });

        // Add new relations
        // We can't do this inside update easily without nested writes.
        // Doing transaction or separate calls.

        // Actually prisma update supports deleteMany and create
        /*
        return prisma.bundle.update({
            where: { id },
            data: {
                ...bundleData,
                courses: {
                    deleteMany: {},
                    create: courseIds.map((cid: string) => ({ courseId: cid }))
                }
            }
        })
        */
        // But let's be explicit and safe
        for (const cid of courseIds) {
            await prisma.bundleCourse.create({
                data: {
                    bundleId: id,
                    courseId: cid
                }
            });
        }
    }

    return prisma.bundle.update({
        where: { id },
        data: bundleData,
        include: {
            courses: { include: { course: true } }
        }
    });
};

export const deleteBundle = async (id: string) => {
    return prisma.bundle.delete({
        where: { id }
    });
};
