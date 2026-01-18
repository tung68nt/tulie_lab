"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var prismaClient = new client_1.PrismaClient();
var PAGES_TO_SEED = [
    {
        title: "Lịch hoạt động",
        slug: "calendar",
        description: "Lịch khai giảng, webinar và các sự kiện mới nhất.",
        isActive: true,
        sections: [
            {
                "id": "hero-calendar",
                "type": "hero",
                "title": "Lịch hoạt động & Sự kiện",
                "subtitle": "Cập nhật lịch khai giảng, webinar và workshop mới nhất từ The Tulie Lab.",
                "image": "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2668&auto=format&fit=crop",
                "ctaText": "Đăng ký tham gia",
                "ctaLink": "#events"
            }
        ]
    },
    {
        title: "Bảng giá & Gói thành viên",
        slug: "pricing",
        description: "Thông tin chi tiết về các gói thành viên và quyền lợi.",
        isActive: true,
        sections: [
            {
                "id": "hero-pricing",
                "type": "hero",
                "title": "Bảng giá & Quyền lợi",
                "subtitle": "Đầu tư cho bản thân là khoản đầu tư siêu lợi nhuận. Chọn gói phù hợp và bắt đầu hành trình ngay.",
                "image": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2000&auto=format&fit=crop",
                "ctaText": "Xem các gói",
                "ctaLink": "#packages"
            }
        ]
    },
    {
        title: "Google Sheets & Apps Script",
        slug: "google-sheets",
        description: "Tự động hóa công việc với Google Ecosystem.",
        isActive: true,
        sections: [
            {
                "id": "hero-sheets",
                "type": "hero",
                "title": "Làm chủ Google Sheets & Apps Script",
                "subtitle": "Biến Google Sheets thành phần mềm quản lý mạnh mẽ. Tự động hóa quy trình, tiết kiệm hàng giờ mỗi ngày.",
                "image": "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2000&auto=format&fit=crop",
                "ctaText": "Khám phá ứng dụng",
                "ctaLink": "#apps"
            }
        ]
    },
    {
        title: "Ứng dụng AI",
        slug: "ai",
        description: "Giải pháp AI thực chiến cho công việc.",
        isActive: true,
        sections: [
            {
                "id": "hero-ai",
                "type": "hero",
                "title": "Ứng dụng AI Thực Chiến",
                "subtitle": "Tích hợp sức mạnh trí tuệ nhân tạo vào quy trình làm việc. Tăng tốc độ, đột phá hiệu suất.",
                "image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format&fit=crop",
                "ctaText": "Xem demo",
                "ctaLink": "#demo"
            }
        ]
    },
    {
        title: "Vibe Coding",
        slug: "vibe-coding",
        description: "Phong cách lập trình hiện đại, sáng tạo.",
        isActive: true,
        sections: [
            {
                "id": "hero-vibe",
                "type": "hero",
                "title": "Vibe Coding",
                "subtitle": "Không chỉ là code, đó là nghệ thuật. Xây dựng sản phẩm với tư duy sáng tạo và trải nghiệm người dùng tối ưu.",
                "image": "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2000&auto=format&fit=crop",
                "ctaText": "Tìm hiểu thêm",
                "ctaLink": "#explore"
            }
        ]
    },
    {
        title: "Template Landing Page (Mẫu)",
        slug: "mau-landing-page",
        description: "Trang mẫu demo tất cả các component.",
        isActive: false,
        sections: [
            {
                "id": "hero-1",
                "type": "hero",
                "title": "Mẫu Landing Page",
                "subtitle": "Đây là trang mẫu để tham khảo cấu trúc.",
                "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
            }
        ]
    }
];
var SLUGS_TO_REMOVE = ["mau-day-du-tinh-nang", "gioi-thieu", "introduction"];
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, PAGES_TO_SEED_1, page, existing;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('Start seeding landing pages...');
                    if (!(SLUGS_TO_REMOVE.length > 0)) return [3 /*break*/, 2];
                    console.log("Removing obsolete pages: ".concat(SLUGS_TO_REMOVE.join(', ')));
                    return [4 /*yield*/, prismaClient.landingPage.deleteMany({
                            where: {
                                slug: { in: SLUGS_TO_REMOVE }
                            }
                        })];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2:
                    _i = 0, PAGES_TO_SEED_1 = PAGES_TO_SEED;
                    _b.label = 3;
                case 3:
                    if (!(_i < PAGES_TO_SEED_1.length)) return [3 /*break*/, 9];
                    page = PAGES_TO_SEED_1[_i];
                    return [4 /*yield*/, prismaClient.landingPage.findUnique({
                            where: { slug: page.slug }
                        })];
                case 4:
                    existing = _b.sent();
                    if (!existing) return [3 /*break*/, 6];
                    console.log("Update existing page: ".concat(page.slug));
                    return [4 /*yield*/, prismaClient.landingPage.update({
                            where: { slug: page.slug },
                            data: {
                                title: page.title,
                                description: page.description,
                                sections: ((_a = existing.sections) === null || _a === void 0 ? void 0 : _a.length) > 0 ? undefined : page.sections,
                                isActive: page.isActive
                            }
                        })];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 6:
                    console.log("Create new page: ".concat(page.slug));
                    return [4 /*yield*/, prismaClient.landingPage.create({
                            data: page
                        })];
                case 7:
                    _b.sent();
                    _b.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 3];
                case 9:
                    console.log('Seeding finished.');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prismaClient.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
