-- Add performance indices for frequently queried fields
-- Note: CONCURRENTLY removed because Prisma Migrate runs in transaction mode

-- Course queries
CREATE INDEX IF NOT EXISTS "idx_courses_published_price" ON "Course"("isPublished", "price") WHERE "isPublished" = true;
CREATE INDEX IF NOT EXISTS "idx_courses_category_published" ON "Course"("categoryId", "isPublished") WHERE "isPublished" = true;

-- Enrollment queries
CREATE INDEX IF NOT EXISTS "idx_enrollments_user_created" ON "Enrollment"("userId", "createdAt" DESC);

-- Order queries
CREATE INDEX IF NOT EXISTS "idx_orders_user_status_created" ON "Order"("userId", "status", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "idx_orders_status_created" ON "Order"("status", "createdAt" DESC) WHERE "status" = 'PENDING';

-- OrderItem queries
CREATE INDEX IF NOT EXISTS "idx_orderitems_course" ON "OrderItem"("courseId") WHERE "courseId" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "idx_orderitems_product" ON "OrderItem"("productId") WHERE "productId" IS NOT NULL;

-- LessonProgress queries
CREATE INDEX IF NOT EXISTS "idx_lessonprogress_user_completed" ON "LessonProgress"("userId", "isCompleted", "completedAt" DESC);

-- User session queries
CREATE INDEX IF NOT EXISTS "idx_usersession_user_createdat" ON "UserSession"("userId", "createdAt" DESC);

-- Blog post queries
CREATE INDEX IF NOT EXISTS "idx_blogpost_published_createdat" ON "BlogPost"("isPublished", "createdAt" DESC) WHERE "isPublished" = true;

-- Product queries
CREATE INDEX IF NOT EXISTS "idx_products_published_type" ON "Product"("isPublished", "type") WHERE "isPublished" = true;
CREATE INDEX IF NOT EXISTS "idx_products_field" ON "Product"("field") WHERE "isPublished" = true;

-- Notification queries
CREATE INDEX IF NOT EXISTS "idx_usernotification_user_read" ON "UserNotification"("userId", "isRead", "createdAt" DESC);

-- Security log queries
CREATE INDEX IF NOT EXISTS "idx_securitylog_action_createdat" ON "SecurityLog"("action", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "idx_activitylog_action_createdat" ON "ActivityLog"("action", "createdAt" DESC);
