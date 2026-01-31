import { Instructor, Prisma } from '@prisma/client';
import { IInstructorRepository } from './interfaces/instructor.repository.interface';


export class InstructorService {
    constructor(private instructorRepository: IInstructorRepository) { }

    async getAllInstructors(page: number = 1, limit: number = 100) {
        return this.instructorRepository.findAll({
            skip: (page - 1) * limit,
            take: limit
        });
    }

    async getInstructorById(id: string) {
        return this.instructorRepository.findById(id);
    }

    async getInstructorBySlug(slug: string) {
        return this.instructorRepository.findBySlug(slug);
    }

    async createInstructor(data: any) {
        const { name, slug, title, bio, avatar, socialLinks, studentCount, courseCount } = data;

        const payload: Prisma.InstructorCreateInput = {
            name,
            slug,
            title,
            bio,
            avatar,
            socialLinks,
            studentCount: studentCount !== undefined ? Number(studentCount) : 0,
            courseCount: courseCount !== undefined ? Number(courseCount) : 0,
        };

        return this.instructorRepository.create(payload);
    }

    async updateInstructor(id: string, data: any) {
        const { name, slug, title, bio, avatar, socialLinks, studentCount, courseCount } = data;

        const payload: Prisma.InstructorUpdateInput = {
            name,
            slug,
            title,
            bio,
            avatar,
            socialLinks,
        };

        // Explicitly handle numeric fields
        if (studentCount !== undefined) payload.studentCount = Number(studentCount);
        if (courseCount !== undefined) payload.courseCount = Number(courseCount);

        return this.instructorRepository.update(id, payload);
    }

    async deleteInstructor(id: string) {
        return this.instructorRepository.delete(id);
    }
}
