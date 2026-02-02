import { PrismaClient, SubmissionStatus, JourneyStatus } from '@prisma/client';

const prisma = new PrismaClient();

// ============== SUBMISSION REVIEW ==============

export interface ListSubmissionsFilter {
    journeyId?: string | undefined;
    status?: SubmissionStatus | undefined;
    limit?: number | undefined;
}

export async function listPendingSubmissions(filters?: ListSubmissionsFilter) {
    const where: any = {};

    if (filters?.status) {
        where.status = filters.status;
    } else {
        where.status = SubmissionStatus.PENDING;
    }

    if (filters?.journeyId) {
        where.step = { journeyId: filters.journeyId };
    }

    return prisma.journeySubmission.findMany({
        where,
        include: {
            enrollment: {
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            profile: { select: { name: true, avatar: true } },
                        },
                    },
                    journey: { select: { id: true, title: true, slug: true } },
                },
            },
            step: { select: { id: true, title: true, position: true, submissionType: true } },
        },
        orderBy: { submittedAt: 'asc' }, // Oldest first
        take: filters?.limit || 50,
    });
}

export async function getSubmissionDetail(submissionId: string) {
    return prisma.journeySubmission.findUnique({
        where: { id: submissionId },
        include: {
            enrollment: {
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            profile: { select: { name: true, avatar: true, phone: true } },
                        },
                    },
                    journey: {
                        include: { steps: { orderBy: { position: 'asc' } } },
                    },
                    submissions: {
                        orderBy: { submittedAt: 'desc' },
                        include: { step: { select: { id: true, title: true, position: true } } },
                    },
                },
            },
            step: true,
        },
    });
}

export interface ReviewSubmissionDto {
    status: SubmissionStatus;
    feedback?: string;
    reviewerId: string;
}

export async function reviewSubmission(submissionId: string, data: ReviewSubmissionDto) {
    // Get submission with enrollment info
    const submission = await prisma.journeySubmission.findUnique({
        where: { id: submissionId },
        include: {
            step: true,
            enrollment: {
                include: { journey: { include: { steps: { orderBy: { position: 'asc' } } } } },
            },
        },
    });

    if (!submission) {
        throw new Error('Submission not found');
    }

    // Update submission
    const updated = await prisma.journeySubmission.update({
        where: { id: submissionId },
        data: {
            status: data.status,
            feedback: data.feedback ?? null,
            reviewedBy: data.reviewerId,
            reviewedAt: new Date(),
        },
    });

    // If approved and this is the current step, advance to next step
    if (data.status === SubmissionStatus.APPROVED) {
        const enrollment = submission.enrollment;
        const currentStepPosition = submission.step.position;

        if (currentStepPosition === enrollment.currentStep) {
            const totalSteps = enrollment.journey.steps.length;
            const nextStep = currentStepPosition + 1;

            if (nextStep > totalSteps) {
                // Journey completed!
                await prisma.journeyEnrollment.update({
                    where: { id: enrollment.id },
                    data: {
                        status: JourneyStatus.COMPLETED,
                        completedAt: new Date(),
                    },
                });
            } else {
                // Advance to next step
                await prisma.journeyEnrollment.update({
                    where: { id: enrollment.id },
                    data: { currentStep: nextStep },
                });
            }
        }
    }

    return updated;
}

// ============== STUDENT PROGRESS DASHBOARD ==============

export async function getStudentProgressDashboard(journeyId: string) {
    const journey = await prisma.learningJourney.findUnique({
        where: { id: journeyId },
        include: { steps: { orderBy: { position: 'asc' } } },
    });

    if (!journey) return null;

    const enrollments = await prisma.journeyEnrollment.findMany({
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
                orderBy: { submittedAt: 'desc' },
            },
        },
        orderBy: { startedAt: 'desc' },
    });

    // Transform to dashboard format
    const students = enrollments.map((enrollment) => {
        const stepStatuses = journey.steps.map((step) => {
            const submissions = enrollment.submissions.filter((s) => s.stepId === step.id);
            const latest = submissions[0];
            return {
                stepId: step.id,
                stepTitle: step.title,
                position: step.position,
                status: latest?.status || (step.position <= enrollment.currentStep ? 'NOT_SUBMITTED' : 'LOCKED'),
                submittedAt: latest?.submittedAt,
            };
        });

        const completedSteps = stepStatuses.filter((s) => s.status === SubmissionStatus.APPROVED).length;
        const progress = Math.round((completedSteps / journey.steps.length) * 100);

        return {
            id: enrollment.id,
            user: enrollment.user,
            currentStep: enrollment.currentStep,
            status: enrollment.status,
            startedAt: enrollment.startedAt,
            completedAt: enrollment.completedAt,
            progress,
            stepStatuses,
        };
    });

    return {
        journey: {
            id: journey.id,
            title: journey.title,
            totalSteps: journey.steps.length,
        },
        students,
        summary: {
            totalEnrolled: enrollments.length,
            inProgress: enrollments.filter((e) => e.status === JourneyStatus.IN_PROGRESS).length,
            completed: enrollments.filter((e) => e.status === JourneyStatus.COMPLETED).length,
        },
    };
}
