import { PrismaClient, JourneyStatus, SubmissionStatus, SubmissionType } from '@prisma/client';

const prisma = new PrismaClient();

// ============== STUDENT JOURNEY QUERIES ==============

export async function listAvailableJourneys() {
    return prisma.learningJourney.findMany({
        where: { isPublished: true },
        include: {
            course: { select: { id: true, title: true, slug: true, thumbnail: true } },
            steps: { orderBy: { position: 'asc' }, select: { id: true, title: true, position: true } },
            _count: { select: { enrollments: true } },
        },
        orderBy: { createdAt: 'desc' },
    });
}

export async function getJourneyDetailForStudent(slug: string, userId?: string) {
    const journey = await prisma.learningJourney.findUnique({
        where: { slug, isPublished: true },
        include: {
            course: { select: { id: true, title: true, slug: true, thumbnail: true } },
            steps: { orderBy: { position: 'asc' } },
        },
    });

    if (!journey) return null;

    // Check if user is enrolled
    let enrollment = null;
    if (userId) {
        enrollment = await prisma.journeyEnrollment.findUnique({
            where: { userId_journeyId: { userId, journeyId: journey.id } },
            include: {
                submissions: {
                    include: { step: { select: { id: true, position: true } } },
                },
            },
        });
    }

    return { journey, enrollment };
}

// ============== ENROLLMENT ==============

export async function enrollInJourney(userId: string, journeyId: string) {
    // Check if already enrolled
    const existing = await prisma.journeyEnrollment.findUnique({
        where: { userId_journeyId: { userId, journeyId } },
    });

    if (existing) {
        return { enrollment: existing, alreadyEnrolled: true };
    }

    // Verify journey exists and is published
    const journey = await prisma.learningJourney.findUnique({
        where: { id: journeyId, isPublished: true },
    });

    if (!journey) {
        throw new Error('Journey not found or not published');
    }

    const enrollment = await prisma.journeyEnrollment.create({
        data: {
            userId,
            journeyId,
            currentStep: 1, // Start at step 1
            status: JourneyStatus.IN_PROGRESS,
        },
        include: {
            journey: { include: { steps: { orderBy: { position: 'asc' } } } },
        },
    });

    return { enrollment, alreadyEnrolled: false };
}

// ============== PROGRESS ==============

export async function getMyProgress(userId: string, journeyId: string) {
    const enrollment = await prisma.journeyEnrollment.findUnique({
        where: { userId_journeyId: { userId, journeyId } },
        include: {
            journey: {
                include: { steps: { orderBy: { position: 'asc' } } },
            },
            submissions: {
                include: { step: { select: { id: true, title: true, position: true } } },
                orderBy: { submittedAt: 'desc' },
            },
        },
    });

    if (!enrollment) return null;

    // Build step progress map
    const stepProgress = enrollment.journey.steps.map((step) => {
        const submissions = enrollment.submissions.filter((s) => s.stepId === step.id);
        const latestSubmission = submissions[0];

        let status: 'locked' | 'current' | 'pending' | 'approved' | 'rejected' | 'revision' = 'locked';

        if (step.position < enrollment.currentStep) {
            // Previous steps
            status = latestSubmission?.status === SubmissionStatus.APPROVED ? 'approved' : 'pending';
        } else if (step.position === enrollment.currentStep) {
            // Current step
            if (!latestSubmission) {
                status = 'current';
            } else {
                status = latestSubmission.status.toLowerCase() as any;
            }
        }
        // else: locked (default)

        return {
            ...step,
            status,
            submission: latestSubmission || null,
        };
    });

    return {
        enrollment: {
            id: enrollment.id,
            currentStep: enrollment.currentStep,
            status: enrollment.status,
            startedAt: enrollment.startedAt,
            completedAt: enrollment.completedAt,
        },
        journey: {
            id: enrollment.journey.id,
            title: enrollment.journey.title,
            slug: enrollment.journey.slug,
        },
        steps: stepProgress,
    };
}

export async function listMyJourneys(userId: string) {
    return prisma.journeyEnrollment.findMany({
        where: { userId },
        include: {
            journey: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    thumbnail: true,
                    steps: { select: { id: true }, orderBy: { position: 'asc' } },
                },
            },
            submissions: {
                where: { status: SubmissionStatus.APPROVED },
                select: { id: true },
            },
        },
        orderBy: { startedAt: 'desc' },
    });
}

// ============== SUBMISSION ==============

export interface SubmitStepDto {
    submissionType: SubmissionType;
    content: string;
    fileName?: string;
}

export async function submitStep(userId: string, journeyId: string, stepId: string, data: SubmitStepDto) {
    // Get enrollment
    const enrollment = await prisma.journeyEnrollment.findUnique({
        where: { userId_journeyId: { userId, journeyId } },
    });

    if (!enrollment) {
        throw new Error('Not enrolled in this journey');
    }

    // Get step
    const step = await prisma.journeyStep.findUnique({
        where: { id: stepId },
    });

    if (!step || step.journeyId !== journeyId) {
        throw new Error('Step not found in this journey');
    }

    // Check if step is current or previous (allow resubmission for rejected)
    if (step.position > enrollment.currentStep) {
        throw new Error('Cannot submit for locked step');
    }

    // Create submission
    const submission = await prisma.journeySubmission.create({
        data: {
            enrollmentId: enrollment.id,
            stepId,
            submissionType: data.submissionType,
            content: data.content,
            fileName: data.fileName ?? null,
            status: SubmissionStatus.PENDING,
        },
        include: {
            step: { select: { id: true, title: true, position: true } },
        },
    });

    return submission;
}
