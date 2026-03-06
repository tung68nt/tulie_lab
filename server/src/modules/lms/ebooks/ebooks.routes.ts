import { Router } from "express";
import { isAuth, isRole } from "../../../../middlewares/auth.middleware";
import * as ebooksController from "./ebooks.controller";

const router = Router();

// ============================================
// ADMIN ROUTES (Must come first to prevent matching /:slug)
// ============================================

// Lấy danh sách Ebooks (Admin)
router.get("/admin", isAuth, isRole(["ADMIN"]), ebooksController.getAdminEbooks);

// Lấy chi tiết 1 Ebook (Admin)
router.get("/admin/:id", isAuth, isRole(["ADMIN"]), ebooksController.getAdminEbookById);

// Tạo mới Ebook
router.post("/admin", isAuth, isRole(["ADMIN"]), ebooksController.createEbook);

// Cập nhật Ebook
router.put("/admin/:id", isAuth, isRole(["ADMIN"]), ebooksController.updateEbook);

// Xóa Ebook
router.delete("/admin/:id", isAuth, isRole(["ADMIN"]), ebooksController.deleteEbook);


// ============================================
// PUBLIC & USER ROUTES 
// ============================================

// Lấy chi tiết Ebook theo slug (Public - Dùng cho Landing page/Shop)
router.get("/:slug", ebooksController.getEbookBySlug);

// Kiểm tra quyền truy cập và lấy presigned URL nếo có quyền (Auth required)
router.get("/:id/access", isAuth, ebooksController.checkEbookAccess);

export default router;
