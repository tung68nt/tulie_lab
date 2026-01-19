import { Instructor, Prisma } from '@prisma/client';
import { IInstructorRepository } from './interfaces/instructor.repository.interface';


export class InstructorService {
    constructor(private instructorRepository: IInstructorRepository) { }

    async getAllInstructors() {
        return this.instructorRepository.findAll();
    }

    async getInstructorById(id: string) {
        return this.instructorRepository.findById(id);
    }

    async createInstructor(data: any) {
        const { name, title, bio, avatar, socialLinks, studentCount, courseCount } = data;

        const payload: Prisma.InstructorCreateInput = {
            name,
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
        const { name, title, bio, avatar, socialLinks, studentCount, courseCount } = data;

        const payload: Prisma.InstructorUpdateInput = {
            name,
            title,
            bio,
            avatar,
            socialLinks,
        };

        if (studentCount !== undefined) {
            payload.studentCount = Number(studentCount);
        }
        if (courseCount !== undefined) {
            payload.courseCount = Number(courseCount);
        }

        return this.instructorRepository.update(id, payload);
    }

    async deleteInstructor(id: string) {
        return this.instructorRepository.delete(id);
    }
}
