
import { CourseService } from './modules/lms/courses/courses.service';
import { PrismaCourseRepository } from './modules/lms/courses/repositories/prisma-course.repository';
import { PrismaLessonRepository } from './modules/lms/courses/repositories/prisma-lesson.repository';
import { PrismaProgressRepository } from './modules/lms/courses/repositories/prisma-progress.repository';

async function main() {
    const courseRepo = new PrismaCourseRepository();
    const lessonRepo = new PrismaLessonRepository();
    const progressRepo = new PrismaProgressRepository();
    const service = new CourseService(courseRepo, lessonRepo, progressRepo);

    const id = 'c99ebfd5-0249-47d2-abed-bc7035a267eb';
    console.log(`Checking Course ID: ${id}`);
    const course = await service.getCourseById(id);
    console.log('Result:', !!course);
    if (course) {
        console.log('Title:', course.title);
        console.log('Lessons:', course.lessons.length);
    }
}
main();
