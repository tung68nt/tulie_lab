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

        // Remove id if it's empty string to let Prisma generate it
        const payload: any = { name, title, bio, avatar, socialLinks };
        if (studentCount !== undefined) payload.studentCount = Number(studentCount);
        if (courseCount !== undefined) payload.courseCount = Number(courseCount);

        return (this.instructorRepository as any).create(payload);
    }

    async updateInstructor(id: string, data: any) {
        const { name, title, bio, avatar, socialLinks, studentCount, courseCount } = data;

        const payload: any = { name, title, bio, avatar, socialLinks };
        if (studentCount !== undefined) payload.studentCount = Number(studentCount);
        if (courseCount !== undefined) payload.courseCount = Number(courseCount);

        return (this.instructorRepository as any).update(id, payload);
    }

    async deleteInstructor(id: string) {
        return (this.instructorRepository as any).delete(id);
    }
}
