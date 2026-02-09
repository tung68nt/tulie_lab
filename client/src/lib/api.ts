/* eslint-disable @typescript-eslint/no-explicit-any */
// RE-EXPORT FROM NEW LOCATIONS
import { BASE_URL, getMediaUrl, ApiError } from './api-client';

export { BASE_URL, getMediaUrl, ApiError };

import { authApi } from '@/features/auth/api/auth.api';
import { coursesApi, adminCoursesApi } from '@/features/lms/api/courses.api';
import { lmsAnalyticsApi } from '@/features/lms/api/analytics.api';
import { journeysApi } from '@/features/lms/api/journeys.api';
import { instructorsApi, adminInstructorsApi } from '@/features/lms/api/instructors.api';
import { bundlesApi } from '@/features/lms/api/bundles.api';
import { mentoringApi } from '@/features/lms/api/mentoring.api';
import { categoriesApi } from '@/features/lms/api/categories.api';
import { ordersApi, checkoutApi } from '@/features/shop/api/orders.api';
import { paymentsApi } from '@/features/shop/api/payments.api';
import { promosApi, couponsApi } from '@/features/shop/api/discounts.api';
import { pricingAddOnsApi } from '@/features/shop/api/pricing-addons.api';
import { productsApi } from '@/features/shop/api/products.api';
import { whiteboardApi } from '@/features/whiteboard/api/whiteboard.api';
import { usersApi, adminUsersApi } from '@/features/system/api/users.api';
import { cmsApi, blogApi } from '@/features/system/api/content.api';
import { settingsApi, securityApi, activityApi, systemApi as sysApi } from '@/features/system/api/settings.api';
import { notificationsApi, contactApi, newsletterApi } from '@/features/system/api/communication.api';
import { mediaApi, uploadApi } from '@/features/system/api/media.api';
import { landingPagesApi, eventsApi, shortLinksApi, activationCodesApi } from '@/features/system/api/marketing.api';
import { request } from './api-client';

// Helper for 'post' generic
const post = (endpoint: string, data: unknown) => request<unknown>(endpoint, { method: 'POST', body: JSON.stringify(data) });

export const api: any = {
    auth: authApi,
    courses: coursesApi,
    users: usersApi,
    instructors: instructorsApi,
    admin: {
        listUsers: adminUsersApi.listUsers,
        getUser: adminUsersApi.getUser,
        enrollUser: adminUsersApi.enrollUser,
        unenrollUser: adminUsersApi.unenrollUser,
        grantMembership: adminUsersApi.grantMembership,
        getInactiveUsers: adminUsersApi.getInactiveUsers,
        blockUser: adminUsersApi.blockUser,
        unblockUser: adminUsersApi.unblockUser,
        deleteUser: adminUsersApi.deleteUser,
        notes: adminUsersApi.notes,
        invoices: adminUsersApi.invoices,

        courses: adminCoursesApi,
        lms: lmsAnalyticsApi,
        users: {
            list: adminUsersApi.list,
            get: adminUsersApi.get,
        },
        orders: ordersApi, // and checkoutApi? No, ordersApi had list, get, updateStatus, export.
        contact: contactApi, // contactApi has admin methods
        settings: settingsApi,
        blog: blogApi.admin,
        payments: paymentsApi,
        cms: cmsApi,
        instructors: adminInstructorsApi,
        media: mediaApi,
    },
    cms: cmsApi,
    blog: blogApi,
    payments: checkoutApi, // api.payments had checkout, getOrder, deleteOrder.
    promos: promosApi,
    notifications: notificationsApi,
    contact: contactApi,
    settings: settingsApi,
    categories: categoriesApi,
    bundles: bundlesApi,
    coupons: couponsApi,
    pricingAddOns: pricingAddOnsApi,
    uploads: uploadApi,
    post: post,
    security: securityApi,
    activity: activityApi,
    system: sysApi,
    landingPages: landingPagesApi,
    events: eventsApi,
    products: productsApi,
    activationCodes: activationCodesApi,
    newsletter: newsletterApi,
    journeys: journeysApi,
    mentoring: mentoringApi,
    whiteboards: whiteboardApi,
    shortLinks: shortLinksApi,
};
