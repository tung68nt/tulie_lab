import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * This script creates a demo course with rich hierarchical structure:
 * - Multiple Chapters
 * - Multiple Sections per Chapter
 * - Multiple Lessons per Section
 * 
 * Used to test the new sidebar layout.
 */
async function main() {
    console.log('🌱 Creating Demo Course with Chapters & Sections...\n');

    // Find or create instructor
    let instructor = await prisma.instructor.findFirst();
    if (!instructor) {
        instructor = await prisma.instructor.create({
            data: {
                name: 'Demo Instructor',
                title: 'Senior Developer',
                bio: 'Demo instructor for testing.',
            }
        });
    }

    // Define rich course structure
    const courseData = {
        title: 'Demo Course - Full Structure',
        slug: 'demo-course-full-structure',
        description: 'A demo course with multiple chapters, sections, and lessons to test sidebar layout.',
        price: 0,
        isPublished: true,
        lessons: [
            // === CHAPTER 1: Giới thiệu ===
            { chapter: 'Chương 1: Giới thiệu', section: '', title: 'Chào mừng đến khóa học', slug: 'welcome', position: 1, isFree: true, duration: '5:30' },
            { chapter: 'Chương 1: Giới thiệu', section: '', title: 'Cách sử dụng nền tảng', slug: 'how-to-use', position: 2, isFree: true, duration: '3:45' },

            // === CHAPTER 2: Cơ bản ===
            { chapter: 'Chương 2: Kiến thức cơ bản', section: 'Phần 2.1: Lý thuyết', title: 'Khái niệm cơ bản A', slug: 'concept-a', position: 3, isFree: true, duration: '8:20' },
            { chapter: 'Chương 2: Kiến thức cơ bản', section: 'Phần 2.1: Lý thuyết', title: 'Khái niệm cơ bản B', slug: 'concept-b', position: 4, isFree: true, duration: '7:15' },
            { chapter: 'Chương 2: Kiến thức cơ bản', section: 'Phần 2.1: Lý thuyết', title: 'Khái niệm cơ bản C', slug: 'concept-c', position: 5, isFree: true, duration: '6:40' },
            { chapter: 'Chương 2: Kiến thức cơ bản', section: 'Phần 2.2: Thực hành', title: 'Bài tập thực hành 1', slug: 'practice-1', position: 6, isFree: false, duration: '12:30' },
            { chapter: 'Chương 2: Kiến thức cơ bản', section: 'Phần 2.2: Thực hành', title: 'Bài tập thực hành 2', slug: 'practice-2', position: 7, isFree: false, duration: '10:45' },

            // === CHAPTER 3: Nâng cao ===
            { chapter: 'Chương 3: Kỹ thuật nâng cao', section: 'Phần 3.1: Patterns', title: 'Design Pattern 1', slug: 'pattern-1', position: 8, isFree: false, duration: '15:20' },
            { chapter: 'Chương 3: Kỹ thuật nâng cao', section: 'Phần 3.1: Patterns', title: 'Design Pattern 2', slug: 'pattern-2', position: 9, isFree: false, duration: '14:10' },
            { chapter: 'Chương 3: Kỹ thuật nâng cao', section: 'Phần 3.1: Patterns', title: 'Design Pattern 3', slug: 'pattern-3', position: 10, isFree: false, duration: '13:55' },
            { chapter: 'Chương 3: Kỹ thuật nâng cao', section: 'Phần 3.2: Best Practices', title: 'Best Practice A', slug: 'best-a', position: 11, isFree: false, duration: '9:30' },
            { chapter: 'Chương 3: Kỹ thuật nâng cao', section: 'Phần 3.2: Best Practices', title: 'Best Practice B', slug: 'best-b', position: 12, isFree: false, duration: '8:45' },
            { chapter: 'Chương 3: Kỹ thuật nâng cao', section: 'Phần 3.3: Anti-patterns', title: 'Anti-pattern 1', slug: 'anti-1', position: 13, isFree: false, duration: '7:20' },
            { chapter: 'Chương 3: Kỹ thuật nâng cao', section: 'Phần 3.3: Anti-patterns', title: 'Anti-pattern 2', slug: 'anti-2', position: 14, isFree: false, duration: '6:50' },

            // === CHAPTER 4: Dự án thực tế ===
            { chapter: 'Chương 4: Dự án thực tế', section: 'Phần 4.1: Setup', title: 'Cài đặt môi trường', slug: 'project-setup', position: 15, isFree: false, duration: '10:00' },
            { chapter: 'Chương 4: Dự án thực tế', section: 'Phần 4.1: Setup', title: 'Cấu hình dự án', slug: 'project-config', position: 16, isFree: false, duration: '8:30' },
            { chapter: 'Chương 4: Dự án thực tế', section: 'Phần 4.2: Development', title: 'Xây dựng tính năng 1', slug: 'feature-1', position: 17, isFree: false, duration: '20:15' },
            { chapter: 'Chương 4: Dự án thực tế', section: 'Phần 4.2: Development', title: 'Xây dựng tính năng 2', slug: 'feature-2', position: 18, isFree: false, duration: '18:40' },
            { chapter: 'Chương 4: Dự án thực tế', section: 'Phần 4.2: Development', title: 'Xây dựng tính năng 3', slug: 'feature-3', position: 19, isFree: false, duration: '22:10' },
            { chapter: 'Chương 4: Dự án thực tế', section: 'Phần 4.3: Testing', title: 'Unit Testing', slug: 'unit-test', position: 20, isFree: false, duration: '12:00' },
            { chapter: 'Chương 4: Dự án thực tế', section: 'Phần 4.3: Testing', title: 'Integration Testing', slug: 'integration-test', position: 21, isFree: false, duration: '15:30' },
            { chapter: 'Chương 4: Dự án thực tế', section: 'Phần 4.4: Deployment', title: 'Deploy lên Production', slug: 'deploy-prod', position: 22, isFree: false, duration: '18:00' },

            // === CHAPTER 5: Bonus ===
            { chapter: 'Chương 5: Bonus', section: '', title: 'Tips & Tricks', slug: 'tips-tricks', position: 23, isFree: false, duration: '10:00' },
            { chapter: 'Chương 5: Bonus', section: '', title: 'Q&A Session', slug: 'qa-session', position: 24, isFree: false, duration: '30:00' },
            { chapter: 'Chương 5: Bonus', section: '', title: 'Kết thúc khóa học', slug: 'conclusion', position: 25, isFree: false, duration: '5:00' },
        ]
    };

    // Delete existing demo course if exists
    await prisma.course.deleteMany({ where: { slug: courseData.slug } });

    // Create course with lessons
    const course = await prisma.course.create({
        data: {
            title: courseData.title,
            slug: courseData.slug,
            description: courseData.description,
            price: courseData.price,
            isPublished: courseData.isPublished,
            instructorId: instructor.id,
            lessons: {
                create: courseData.lessons.map(l => ({
                    title: l.title,
                    slug: l.slug,
                    position: l.position,
                    isFree: l.isFree,
                    duration: l.duration,
                    chapter: l.chapter,
                    section: l.section || null,
                    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder
                }))
            }
        },
        include: { lessons: true }
    });

    console.log(`✅ Created: ${course.title}`);
    console.log(`   📚 ${course.lessons.length} lessons`);
    console.log(`   📖 5 chapters`);
    console.log(`   📂 10 sections`);
    console.log(`\n🔗 Test URL: /learn/${course.slug}/${course.lessons[0]?.slug || 'welcome'}`);
}

main()
    .catch((e) => {
        console.error('❌ Failed:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
