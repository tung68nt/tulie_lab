import { container } from './core/container';
import { PrismaProductRepository } from './modules/shop/products/repositories/prisma-product.repository';
import { ProductService } from './modules/shop/products/products.service';
import { PrismaCourseRepository } from './modules/lms/courses/repositories/prisma-course.repository';
import { PrismaLessonRepository } from './modules/lms/courses/repositories/prisma-lesson.repository';
import { PrismaProgressRepository } from './modules/lms/courses/repositories/prisma-progress.repository';
import { CourseService } from './modules/lms/courses/courses.service';
import { PrismaLandingPageRepository } from './modules/info/landing-pages/repositories/prisma-landing-page.repository';
import { LandingPageService } from './modules/info/landing-pages/landing-pages.service';
import { PrismaUserRepository } from './modules/system/users/repositories/prisma-user.repository';
import { UserService } from './modules/system/users/users.service';
import { AuthService } from './modules/system/auth/auth.service';
import { PrismaSettingRepository } from './modules/system/settings/repositories/prisma-setting.repository';
import { SettingService } from './modules/system/settings/settings.service';
import { PrismaActivationCodeRepository } from './modules/shop/activation-codes/repositories/prisma-activation-code.repository';
import { ActivationCodeService } from './modules/shop/activation-codes/activation-codes.service';
import { PrismaBlogPostRepository } from './modules/info/blog/repositories/prisma-blog-post.repository';
import { BlogService } from './modules/info/blog/blog.service';
import { PrismaContactRepository } from './modules/info/contact/repositories/prisma-contact.repository';
import { ContactService } from './modules/info/contact/contact.service';
import { PrismaCategoryRepository } from './modules/lms/categories/repositories/prisma-category.repository';
import { CategoryService } from './modules/lms/categories/categories.service';
import { PrismaInstructorRepository } from './modules/lms/instructors/repositories/prisma-instructor.repository';
import { InstructorService } from './modules/lms/instructors/instructors.service';
import { EventBus } from './core/event-bus';
import { PrismaOrderRepository } from './modules/shop/payments/repositories/prisma-order.repository';
import { PaymentService } from './modules/shop/payments/payments.service';
import redisService from './services/redis.service';
import { EventRepository } from './modules/lms/events/events.repository';
import { EventService } from './modules/lms/events/events.service';
import { TelegramEventSubscriber } from './modules/system/notifications/telegram-subscriber';

/**
 * Initializes all dependencies and registers them in the DI container.
 */
export const bootstrapDI = () => {
    // Infrastructure
    const eventBus = EventBus.getInstance();
    container.register('EventBus', eventBus);
    container.register('CacheProvider', redisService);

    // Repositories
    const productRepository = new PrismaProductRepository();
    container.register('IProductRepository', productRepository);

    const courseRepository = new PrismaCourseRepository();
    const lessonRepository = new PrismaLessonRepository();
    const progressRepository = new PrismaProgressRepository();
    container.register('ICourseRepository', courseRepository);
    container.register('ILessonRepository', lessonRepository);
    container.register('IProgressRepository', progressRepository);

    const categoryRepository = new PrismaCategoryRepository();
    container.register('ICategoryRepository', categoryRepository);

    const instructorRepository = new PrismaInstructorRepository();
    container.register('IInstructorRepository', instructorRepository);

    const landingPageRepository = new PrismaLandingPageRepository();
    container.register('ILandingPageRepository', landingPageRepository);

    const userRepository = new PrismaUserRepository();
    container.register('IUserRepository', userRepository);

    const settingRepository = new PrismaSettingRepository();
    container.register('ISettingRepository', settingRepository);

    const activationCodeRepository = new PrismaActivationCodeRepository();
    container.register('IActivationCodeRepository', activationCodeRepository);

    const blogPostRepository = new PrismaBlogPostRepository();
    container.register('IBlogPostRepository', blogPostRepository);

    const contactRepository = new PrismaContactRepository();
    container.register('IContactRepository', contactRepository);

    const orderRepository = new PrismaOrderRepository();
    container.register('IOrderRepository', orderRepository);

    const eventRepository = new EventRepository();
    container.register('EventRepository', eventRepository);

    // Services
    const productService = new ProductService(productRepository);
    container.register('ProductService', productService);

    const courseService = new CourseService(courseRepository, lessonRepository, progressRepository, redisService);
    container.register('CourseService', courseService);

    const categoryService = new CategoryService(categoryRepository);
    container.register('CategoryService', categoryService);

    const instructorService = new InstructorService(instructorRepository);
    container.register('InstructorService', instructorService);

    const landingPageService = new LandingPageService(landingPageRepository, redisService);
    container.register('LandingPageService', landingPageService);

    const authService = new AuthService(userRepository);
    container.register('AuthService', authService);

    const userService = new UserService(userRepository);
    container.register('UserService', userService);

    const settingService = new SettingService(settingRepository);
    container.register('SettingService', settingService);

    const activationCodeService = new ActivationCodeService(activationCodeRepository, courseRepository, progressRepository, productRepository, orderRepository);
    container.register('ActivationCodeService', activationCodeService);

    const blogService = new BlogService(blogPostRepository, redisService);
    container.register('BlogService', blogService);

    const contactService = new ContactService(contactRepository);
    container.register('ContactService', contactService);

    const paymentService = new PaymentService(
        orderRepository,
        userRepository,
        courseRepository,
        productRepository,
        activationCodeRepository,
        eventBus
    );
    container.register('PaymentService', paymentService);

    const eventService = new EventService(eventRepository);
    container.register('EventService', eventService);

    // Listeners
    const { OrderPaidListener } = require('./modules/shop/payments/listeners/order-paid.listener');
    new OrderPaidListener(
        eventBus,
        orderRepository,
        activationCodeRepository,
        courseRepository,
        userRepository
    );

    // Telegram Notifications
    TelegramEventSubscriber.getInstance();

    console.log('📦 Dependency Injection initialized');
};
