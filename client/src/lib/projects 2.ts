export const PROJECTS_DATA = [
    {
        slug: 'taskflow-quan-ly-cong-viec',
        title: "TaskFlow - Quản lý công việc",
        student: "Nguyễn Minh Tuấn",
        description: "Ứng dụng quản lý task với drag-drop, real-time sync giữa các thành viên team.",
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
        tech: ["React", "Node.js", "Socket.io"],
        content: "TaskFlow là giải pháp quản lý công việc trực quan, giúp các đội nhóm nhỏ và vừa tối ưu hóa quy trình làm việc. Dự án tích hợp các tính năng nâng cao như kéo thả (drag & drop), cập nhật thời gian thực (real-time updates) và báo cáo tiến độ tự động.",
        features: [
            "Giao diện Kanban trực quan",
            "Real-time sync với Socket.io",
            "Phân quyền thành viên chi tiết",
            "Báo cáo thống kê hiệu suất"
        ],
        demoUrl: "#",
        repoUrl: "#"
    },
    {
        slug: 'foodieapp-dat-do-an',
        title: "FoodieApp - Đặt đồ ăn",
        student: "Trần Hoàng Anh",
        description: "Ứng dụng đặt đồ ăn với tích hợp thanh toán và theo dõi đơn hàng real-time.",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop",
        tech: ["React Native", "Firebase", "Stripe"],
        content: "FoodieApp mang đến trải nghiệm đặt món nhanh chóng và tiện lợi. Hệ thống xử lý đơn hàng thời gian thực, tích hợp cổng thanh toán an toàn và theo dõi vị trí shipper trên bản đồ.",
        features: [
            "Tìm kiếm và lọc món ăn thông minh",
            "Thanh toán online qua Stripe",
            "Real-time tracking đơn hàng",
            "Hệ thống voucher và tích điểm"
        ],
        demoUrl: "#",
        repoUrl: "#"
    },
    {
        slug: 'learnhub-lms-platform',
        title: "LearnHub - LMS Platform",
        student: "Phạm Thị Lan",
        description: "Nền tảng học trực tuyến với video streaming, quiz và chứng chỉ tự động.",
        image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=400&fit=crop",
        tech: ["Next.js", "PostgreSQL", "AWS"],
        content: "LearnHub là nền tảng LMS hiện đại hỗ trợ học tập đa phương tiện. Hệ thống video streaming tối ưu, bài kiểm tra trắc nghiệm tự động chấm điểm và cấp chứng chỉ số ngay sau khi hoàn thành khóa học.",
        features: [
            "Video streaming chất lượng 4K",
            "Hệ thống Quiz tương tác",
            "Cấp chứng chỉ PDF tự động",
            "Thanh toán khóa học tích hợp"
        ],
        demoUrl: "#",
        repoUrl: "#"
    },
    {
        slug: 'healthtrack-theo-doi-suc-khoe',
        title: "HealthTrack - Theo dõi sức khỏe",
        student: "Lê Văn Đức",
        description: "App theo dõi sức khỏe tích hợp AI để phân tích và đưa ra lời khuyên.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop",
        tech: ["Flutter", "Python", "TensorFlow"],
        content: "HealthTrack không chỉ là ứng dụng theo dõi chỉ số sức khỏe mà còn là trợ lý ảo cá nhân. Sử dụng AI để phân tích dữ liệu nhịp tim, giấc ngủ và vận động để đưa ra các lời khuyên sức khỏe được cá nhân hóa.",
        features: [
            "Tracking chỉ số (nhịp tim, bước chân)",
            "AI phân tích sức khỏe",
            "Chế độ tập luyện cá nhân hóa",
            "Nhắc nhở uống nước và vận động"
        ],
        demoUrl: "#",
        repoUrl: "#"
    },
    {
        slug: 'fintrack-quan-ly-tai-chinh',
        title: "FinTrack - Quản lý tài chính",
        student: "Trần Thu Hà",
        description: "Ứng dụng quản lý chi tiêu cá nhân, tích hợp import SMS ngân hàng tự động.",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&h=400&fit=crop",
        tech: ["React Native", "NestJS", "MongoDB"],
        content: "FinTrack giúp việc quản lý tài chính cá nhân trở nên đơn giản hơn bao giờ hết. Tính năng nổi bật là khả năng tự động đọc và phân loại giao dịch từ tin nhắn SMS ngân hàng, giúp người dùng tiết kiệm thời gian nhập liệu.",
        features: [
            "Tự động import từ SMS Banking",
            "Báo cáo chi tiêu trực quan",
            "Lập ngân sách thông minh",
            "Đồng bộ đa thiết bị"
        ],
        demoUrl: "#",
        repoUrl: "#"
    },
    {
        slug: 'travelmate-len-lich-trinh-du-lich',
        title: "TravelMate - Lên lịch trình du lịch",
        student: "Nguyễn Văn Hùng",
        description: "Nền tảng gợi ý lịch trình du lịch dựa trên sở thích và ngân sách sử dụng AI.",
        image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop",
        tech: ["Next.js", "OpenAI API", "Supabase"],
        content: "TravelMate sử dụng sức mạnh của Generative AI để tạo ra các lịch trình du lịch độc đáo. Chỉ cần nhập điểm đến, thời gian và ngân sách, hệ thống sẽ gợi ý lịch trình chi tiết từng giờ, kèm theo địa điểm ăn uống và vui chơi.",
        features: [
            "AI Planner gợi ý lịch trình",
            "Booking vé và khách sạn",
            "Cộng đồng chia sẻ kinh nghiệm",
            "Bản đồ offline"
        ],
        demoUrl: "#",
        repoUrl: "#"
    }
];
