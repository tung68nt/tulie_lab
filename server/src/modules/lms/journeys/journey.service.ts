import { PrismaClient, JourneyStatus, SubmissionStatus, SubmissionType } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateJourneyDto {
    title: string;
    slug: string;
    description?: string;
    thumbnail?: string;
    courseId?: string;
    isPublished?: boolean;
    isAddOn?: boolean;
    price?: number;
}

export interface UpdateJourneyDto extends Partial<CreateJourneyDto> { }

export interface CreateStepDto {
    journeyId: string;
    title: string;
    description?: string;
    position?: number;
    submissionType?: SubmissionType;
    isRequired?: boolean;
    deadlineDays?: number;
}

export interface UpdateStepDto extends Partial<Omit<CreateStepDto, 'journeyId'>> { }

// ============== JOURNEY CRUD ==============

export async function listJourneys(filters?: { isPublished?: boolean; courseId?: string }) {
    const where: any = {};
    if (filters?.isPublished !== undefined) where.isPublished = filters.isPublished;
    if (filters?.courseId) where.courseId = filters.courseId;

    return prisma.learningJourney.findMany({
        where,
        include: {
            course: { select: { id: true, title: true, slug: true } },
            steps: { orderBy: { position: 'asc' } },
            _count: { select: { enrollments: true } },
        },
        orderBy: { createdAt: 'desc' },
    });
}

export async function getJourneyById(id: string) {
    return prisma.learningJourney.findUnique({
        where: { id },
        include: {
            course: { select: { id: true, title: true, slug: true } },
            steps: { orderBy: { position: 'asc' } },
            _count: { select: { enrollments: true } },
        },
    });
}

export async function getJourneyBySlug(slug: string) {
    return prisma.learningJourney.findUnique({
        where: { slug },
        include: {
            course: { select: { id: true, title: true, slug: true } },
            steps: { orderBy: { position: 'asc' } },
            _count: { select: { enrollments: true } },
        },
    });
}

export async function createJourney(data: CreateJourneyDto) {
    return prisma.learningJourney.create({
        data: {
            title: data.title,
            slug: data.slug,
            description: data.description ?? null,
            thumbnail: data.thumbnail ?? null,
            courseId: data.courseId ?? null,
            isPublished: data.isPublished ?? false,
            isAddOn: data.isAddOn ?? false,
            price: data.price ?? 0,
        },
        include: {
            steps: true,
        },
    });
}

export async function updateJourney(id: string, data: UpdateJourneyDto) {
    return prisma.learningJourney.update({
        where: { id },
        data,
        include: {
            steps: { orderBy: { position: 'asc' } },
        },
    });
}

export async function deleteJourney(id: string) {
    return prisma.learningJourney.delete({ where: { id } });
}

// ============== STEP CRUD ==============

export async function createStep(data: CreateStepDto) {
    // Auto-set position if not provided
    if (data.position === undefined) {
        const lastStep = await prisma.journeyStep.findFirst({
            where: { journeyId: data.journeyId },
            orderBy: { position: 'desc' },
        });
        data.position = (lastStep?.position ?? -1) + 1;
    }

    return prisma.journeyStep.create({
        data: {
            journeyId: data.journeyId,
            title: data.title,
            description: data.description ?? null,
            position: data.position!,
            submissionType: data.submissionType ?? SubmissionType.ANY,
            isRequired: data.isRequired ?? true,
            deadlineDays: data.deadlineDays ?? null,
        },
    });
}

export async function updateStep(id: string, data: UpdateStepDto) {
    return prisma.journeyStep.update({
        where: { id },
        data,
    });
}

export async function deleteStep(id: string) {
    return prisma.journeyStep.delete({ where: { id } });
}

export async function reorderSteps(journeyId: string, stepIds: string[]) {
    const updates = stepIds.map((id, index) =>
        prisma.journeyStep.update({
            where: { id },
            data: { position: index },
        })
    );
    return prisma.$transaction(updates);
}

// ============== ENROLLMENT QUERIES (Admin) ==============

export async function getJourneyEnrollments(journeyId: string) {
    return prisma.journeyEnrollment.findMany({
        where: { journeyId },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    profile: { select: { name: true, avatar: true } },
                },
            },
            submissions: {
                include: { step: { select: { id: true, title: true, position: true } } },
                orderBy: { submittedAt: 'desc' },
            },
        },
        orderBy: { startedAt: 'desc' },
    });
}

export async function getEnrollmentStats(journeyId: string) {
    const enrollments = await prisma.journeyEnrollment.groupBy({
        by: ['status'],
        where: { journeyId },
        _count: true,
    });

    const totalSteps = await prisma.journeyStep.count({ where: { journeyId } });
    const pendingSubmissions = await prisma.journeySubmission.count({
        where: {
            step: { journeyId },
            status: SubmissionStatus.PENDING,
        },
    });

    return {
        enrollments: enrollments.reduce((acc, e) => {
            acc[e.status] = e._count;
            return acc;
        }, {} as Record<string, number>),
        totalSteps,
        pendingSubmissions,
    };
}
