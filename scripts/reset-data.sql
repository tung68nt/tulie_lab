-- ============================================
-- Pre-Production Data Reset Script
-- Run this to clear test data before launch
-- ============================================

-- 1. Reset Orders and Payments
DELETE FROM "Order";
DELETE FROM "PaymentTransaction";

-- 2. Reset Enrollments (students will need to re-purchase)
DELETE FROM "Enrollment";

-- 3. Reset Activity and Security Logs
DELETE FROM "ActivityLog";
DELETE FROM "SecurityLog";

-- 4. Reset Contact Submissions
DELETE FROM "ContactSubmission";

-- 5. Reset User Notifications
DELETE FROM "UserNotification";

-- Note: This does NOT delete:
-- - Users (keep user accounts)
-- - Courses (keep course content)
-- - Lessons (keep lesson content)
-- - Blog posts (keep blog content)
-- - System settings (keep configuration)

-- After running this, verify with:
-- SELECT COUNT(*) FROM "Order";
-- SELECT COUNT(*) FROM "Enrollment";
-- SELECT COUNT(*) FROM "ActivityLog";
