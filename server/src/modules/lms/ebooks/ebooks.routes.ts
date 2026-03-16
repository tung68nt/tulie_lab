import { Router } from "express";
import { authenticate, authorize } from "../../../middleware/auth.middleware";
import { Role } from "@prisma/client";
import * as ebooksController from "./ebooks.controller";

const router = Router();

// ============================================
// ADMIN ROUTES (Must come first to prevent matching /:slug)
// ============================================

// Lấy danh sách Ebooks (Admin)
router.get("/admin", authenticate, authorize([Role.ADMIN]), ebooksController.getAdminEbooks);

// Lấy chi tiết 1 Ebook (Admin)
router.get("/admin/:id", authenticate, authorize([Role.ADMIN]), ebooksController.getAdminEbookById);

// Tạo mới Ebook
router.post("/admin", authenticate, authorize([Role.ADMIN]), ebooksController.createEbook);

// Cập nhật Ebook
router.put("/admin/:id", authenticate, authorize([Role.ADMIN]), ebooksController.updateEbook);

// Xóa Ebook
router.delete("/admin/:id", authenticate, authorize([Role.ADMIN]), ebooksController.deleteEbook);


// ============================================
// PUBLIC & USER ROUTES 
// ============================================

// Lấy danh sách Ebooks (Public)
router.get("/", ebooksController.getEbooks);

// Lấy chi tiết Ebook theo slug (Public - Dùng cho Landing page/Shop)
router.get("/:slug", ebooksController.getEbookBySlug);

// Kiểm tra quyền truy cập và lấy presigned URL nếo có quyền (Auth required)
router.get("/:id/access", authenticate, ebooksController.checkEbookAccess);

export default router;
