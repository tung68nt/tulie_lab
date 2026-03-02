import nodemailer from 'nodemailer';
import prisma from '../config/prisma';

// Function to get the latest SMTP configuration and create a transporter
const getTransporter = async () => {
    // 1. Try to get from database first
    const smtpSettings = await prisma.systemSetting.findMany({
        where: {
            key: {
                in: ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_secure']
            }
        }
    });

    const settings: Record<string, string> = {};
    smtpSettings.forEach((s: any) => {
        settings[s.key] = s.value;
    });

    const host = settings['smtp_host'] || process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(settings['smtp_port'] || process.env.SMTP_PORT || '587');
    const secure = (settings['smtp_secure'] || process.env.SMTP_SECURE) === 'true';
    const user = settings['smtp_user'] || process.env.SMTP_USER;
    const pass = settings['smtp_pass'] || process.env.SMTP_PASS;

    if (!user || !pass) {
        console.warn('[EmailService] SMTP credentials missing. Email sending will likely fail.');
    }

    return nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
            user,
            pass,
        },
    });
};

// Helper to log email sends
const logEmail = async (data: {
    to: string;
    subject: string;
    type: string;
    status: 'sent' | 'failed';
    userId?: string;
    orderId?: string;
    error?: string;
}) => {
    try {
        await prisma.emailLog.create({
            data: {
                to: data.to,
                subject: data.subject,
                type: data.type,
                status: data.status,
                userId: data.userId ?? null,
                orderId: data.orderId ?? null,
                error: data.error ?? null
            }
        });
    } catch (e) {
        console.error('Error logging email:', e);
    }
};

// Email templates - Simple Black & White Style
const emailTemplates = {
    passwordReset: (resetLink: string, userName?: string) => ({
        subject: 'Đặt lại mật khẩu - The Tulie Lab',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Đặt lại mật khẩu</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #000; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fff;">
                <div style="border: 1px solid #e0e0e0; padding: 40px;">
                    <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 30px 0; color: #000;">The Tulie Lab</h1>
                    <p style="font-size: 16px; margin: 0 0 20px 0;">Xin chào${userName ? ` ${userName}` : ''},</p>
                    <p style="font-size: 14px; color: #333; margin: 0 0 10px 0;">Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
                    <p style="font-size: 14px; color: #333; margin: 0 0 30px 0;">Nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
                    <div style="margin: 30px 0;">
                        <a href="${resetLink}" style="background-color: #000; color: #fff; padding: 14px 32px; text-decoration: none; font-size: 14px; font-weight: 500; display: inline-block;">
                            Đặt lại mật khẩu
                        </a>
                    </div>
                    <p style="font-size: 13px; color: #666; margin: 30px 0 10px 0;">Link này sẽ hết hạn sau 1 giờ.</p>
                    <p style="font-size: 13px; color: #666; margin: 0;">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0 20px 0;">
                    <p style="font-size: 12px; color: #999; margin: 0;">
                        © ${new Date().getFullYear()} The Tulie Lab. Học để làm được, không chỉ để biết.
                    </p>
                </div>
            </body>
            </html>
        `,
    }),

    welcomeEmail: (userName: string, loginLink: string) => ({
        subject: 'Chào mừng đến với The Tulie Lab',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Chào mừng</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #000; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fff;">
                <div style="border: 1px solid #e0e0e0; padding: 40px;">
                    <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 30px 0; color: #000;">The Tulie Lab</h1>
                    <p style="font-size: 16px; margin: 0 0 20px 0;">Chào mừng ${userName}!</p>
                    <p style="font-size: 14px; color: #333; margin: 0 0 10px 0;">Cảm ơn bạn đã đăng ký tài khoản tại The Tulie Lab.</p>
                    <p style="font-size: 14px; color: #333; margin: 0 0 30px 0;">Bạn đã sẵn sàng bắt đầu hành trình học tập của mình.</p>
                    <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0;">
                        <p style="font-weight: 600; margin: 0 0 15px 0; font-size: 14px;">Bắt đầu ngay:</p>
                        <ul style="color: #333; padding-left: 20px; margin: 0; font-size: 14px;">
                            <li style="margin-bottom: 8px;">Khám phá các khóa học chất lượng cao</li>
                            <li style="margin-bottom: 8px;">Học từ giảng viên giàu kinh nghiệm</li>
                            <li>Thực hành với các dự án thực tế</li>
                        </ul>
                    </div>
                    <div style="margin: 30px 0;">
                        <a href="${loginLink}" style="background-color: #000; color: #fff; padding: 14px 32px; text-decoration: none; font-size: 14px; font-weight: 500; display: inline-block;">
                            Khám phá khóa học
                        </a>
                    </div>
                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0 20px 0;">
                    <p style="font-size: 12px; color: #999; margin: 0;">
                        © ${new Date().getFullYear()} The Tulie Lab. Học để làm được, không chỉ để biết.
                    </p>
                </div>
            </body>
            </html>
        `,
    }),

    orderConfirmation: (orderCode: string, amount: number, courses: string[], paymentInfo: any) => ({
        subject: `Xác nhận đơn hàng #${orderCode} - The Tulie Lab`,
        html: `
            <!DOCTYPE html>
            <html>
             <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Xác nhận đơn hàng</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #000; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fff;">
                <div style="border: 1px solid #e0e0e0; padding: 40px;">
                    <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 30px 0; color: #000;">The Tulie Lab</h1>
                    <p style="font-size: 16px; margin: 0 0 20px 0;">Đơn hàng của bạn đã được tạo</p>
                    <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0;">
                        <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Mã đơn hàng:</strong> ${orderCode}</p>
                        <p style="margin: 0; font-size: 14px;"><strong>Tổng tiền:</strong> ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}</p>
                    </div>
                    <p style="font-weight: 600; margin: 20px 0 10px 0; font-size: 14px;">Khóa học trong đơn:</p>
                    <ul style="color: #333; padding-left: 20px; margin: 0 0 20px 0; font-size: 14px;">
                        ${courses.map(c => `<li style="margin-bottom: 5px;">${c}</li>`).join('')}
                    </ul>
                    <div style="border: 1px solid #000; padding: 20px; margin: 20px 0;">
                        <p style="font-weight: 600; margin: 0 0 15px 0; font-size: 14px;">Thông tin thanh toán:</p>
                        <p style="margin: 0 0 5px 0; font-size: 14px;"><strong>Ngân hàng:</strong> ${paymentInfo.bank}</p>
                        <p style="margin: 0 0 5px 0; font-size: 14px;"><strong>Số tài khoản:</strong> ${paymentInfo.accountNumber}</p>
                        <p style="margin: 0 0 5px 0; font-size: 14px;"><strong>Chủ tài khoản:</strong> ${paymentInfo.accountName}</p>
                        <p style="margin: 15px 0 0 0; font-size: 14px;"><strong>Nội dung CK:</strong> ORDER-${orderCode}</p>
                    </div>
                    <p style="font-size: 13px; color: #666; margin: 20px 0;">Sau khi thanh toán, hệ thống sẽ tự động xác nhận và mở khóa khóa học cho bạn.</p>
                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0 20px 0;">
                    <p style="font-size: 12px; color: #999; margin: 0;">
                        © ${new Date().getFullYear()} The Tulie Lab. Học để làm được, không chỉ để biết.
                    </p>
                </div>
            </body>
            </html>
        `,
    }),

    birthdayCoupon: (userName: string, couponCode: string, discount: string) => ({
        subject: `🎁 Chúc mừng sinh nhật, ${userName}! - The Tulie Lab`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Chúc mừng sinh nhật</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #000; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fff;">
                <div style="border: 1px solid #e0e0e0; padding: 40px;">
                    <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 20px 0; color: #000;">Happy Birthday! 🎂</h1>
                    <p style="font-size: 16px; margin: 0 0 20px 0;">Chào ${userName},</p>
                    <p style="font-size: 14px; color: #333; margin: 0 0 20px 0;">Mừng sinh nhật bạn! Tulie Academy gửi tặng bạn món quà nhỏ để thêm niềm vui cho ngày đặc biệt này.</p>
                    
                    <div style="background-color: #f9f9f9; border: 1px dashed #000; padding: 30px; margin: 30px 0; text-align: center;">
                        <p style="margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Mã giảm giá độc quyền của bạn</p>
                        <p style="margin: 0 0 20px 0; font-size: 32px; font-weight: 700; color: #000;">${couponCode}</p>
                        <div style="display: inline-block; background: #000; color: #fff; padding: 4px 12px; border-radius: 4px; font-size: 14px;">
                            Giảm ${discount}
                        </div>
                        <p style="margin: 20px 0 0 0; font-size: 13px; color: #666;">Hạn sử dụng: 30 ngày kể từ hôm nay</p>
                    </div>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/courses" style="background-color: #000; color: #fff; padding: 14px 32px; text-decoration: none; font-size: 14px; font-weight: 500; display: inline-block;">
                            Dùng mã ngay
                        </a>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0 20px 0;">
                    <p style="font-size: 12px; color: #999; margin: 0;">
                        © ${new Date().getFullYear()} The Tulie Lab. Học để làm được, không chỉ để biết.
                    </p>
                </div>
            </body>
            </html>
        `,
    }),

    paymentSuccess: (userName: string, orderCode: string, courses: string[]) => ({
        subject: `✓ Thanh toán thành công #${orderCode} - The Tulie Lab`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Thanh toán thành công</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #000; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fff;">
                <div style="border: 1px solid #e0e0e0; padding: 40px;">
                    <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 30px 0; color: #000;">The Tulie Lab</h1>
                    <div style="background-color: #f0fdf4; border: 1px solid #22c55e; padding: 20px; margin: 0 0 30px 0; text-align: center;">
                        <p style="color: #22c55e; font-size: 18px; font-weight: 600; margin: 0;">✓ Thanh toán thành công!</p>
                    </div>
                    <p style="font-size: 16px; margin: 0 0 20px 0;">Xin chào ${userName},</p>
                    <p style="font-size: 14px; color: #333; margin: 0 0 20px 0;">Thanh toán cho đơn hàng <strong>#${orderCode}</strong> đã được xác nhận.</p>
                    <p style="font-weight: 600; margin: 20px 0 10px 0; font-size: 14px;">Khóa học đã kích hoạt:</p>
                    <ul style="color: #333; padding-left: 20px; margin: 0 0 20px 0; font-size: 14px;">
                        ${courses.map(c => `<li style="margin-bottom: 5px;">${c}</li>`).join('')}
                    </ul>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard" style="background-color: #000; color: #fff; padding: 14px 32px; text-decoration: none; font-size: 14px; font-weight: 500; display: inline-block;">
                            Vào học ngay
                        </a>
                    </div>
                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0 20px 0;">
                    <p style="font-size: 12px; color: #999; margin: 0;">
                        © ${new Date().getFullYear()} The Tulie Lab. Học để làm được, không chỉ để biết.
                    </p>
                </div>
            </body>
            </html>
        `,
    }),

    adminNewContact: (submission: { name: string; email: string; phone?: string; message: string }) => ({
        subject: `[Liên hệ mới] từ ${submission.name}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"></head>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #000;">Có liên hệ mới từ website</h2>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
                    <p><strong>Tên:</strong> ${submission.name}</p>
                    <p><strong>Email:</strong> ${submission.email}</p>
                    ${submission.phone ? `<p><strong>SĐT:</strong> ${submission.phone}</p>` : ''}
                    <p><strong>Nội dung:</strong></p>
                    <p style="white-space: pre-wrap; background: #fff; padding: 15px; border: 1px solid #ddd;">${submission.message}</p>
                </div>
            </body>
            </html>
        `,
    }),

    adminNewOrder: (orderCode: string, userEmail: string, courses: string[], amount: number) => ({
        subject: `[Đơn hàng mới] #${orderCode} - ${new Intl.NumberFormat('vi-VN').format(amount)}đ`,
        html: `
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"></head>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #000;">Có đơn hàng mới!</h2>
                <div style="background: #fff7ed; padding: 20px; border-radius: 8px; border: 1px solid #f97316;">
                    <p><strong>Mã đơn:</strong> ${orderCode}</p>
                    <p><strong>Khách hàng:</strong> ${userEmail}</p>
                    <p><strong>Khóa học:</strong></p>
                    <ul>${courses.map(c => `<li>${c}</li>`).join('')}</ul>
                    <p><strong>Số tiền:</strong> ${new Intl.NumberFormat('vi-VN').format(amount)}đ</p>
                </div>
            </body>
            </html>
        `,
    }),

    paymentReminder: (data: {
        userName: string;
        orderCode: string;
        amount: number;
        courses: string[];
        bankName: string;
        accountNo: string;
        accountName: string;
        transferContent: string;
        qrUrl: string;
        customMessage?: string;
    }) => ({
        subject: `⏰ Nhắc thanh toán đơn hàng #${data.orderCode} - The Tulie Lab`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Nhắc thanh toán</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #000; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fff;">
                <div style="border: 1px solid #e0e0e0; padding: 40px;">
                    <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 30px 0; color: #000;">The Tulie Lab</h1>
                    
                    <p style="font-size: 16px; margin: 0 0 20px 0;">Xin chào ${data.userName},</p>
                    
                    ${data.customMessage ? `<p style="font-size: 14px; color: #333; margin: 0 0 20px 0; background: #f9f9f9; padding: 15px; border-left: 3px solid #000;">${data.customMessage}</p>` : ''}
                    
                    <p style="font-size: 14px; color: #333; margin: 0 0 10px 0;">Đơn hàng <strong>#${data.orderCode}</strong> của bạn đang chờ thanh toán.</p>
                    
                    <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0;">
                        <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Khóa học:</strong></p>
                        <ul style="color: #333; padding-left: 20px; margin: 0 0 15px 0; font-size: 14px;">
                            ${data.courses.map(c => `<li style="margin-bottom: 5px;">${c}</li>`).join('')}
                        </ul>
                        <p style="margin: 0; font-size: 18px; font-weight: bold;">Tổng tiền: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.amount)}</p>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <p style="font-size: 14px; margin: 0 0 15px 0; font-weight: 600;">Quét mã QR để thanh toán:</p>
                        <img src="${data.qrUrl}" alt="QR Code thanh toán" style="width: 200px; height: 200px; border: 1px solid #e0e0e0; padding: 10px; background: #fff;">
                    </div>
                    
                    <div style="border: 1px solid #000; padding: 20px; margin: 20px 0;">
                        <p style="font-weight: 600; margin: 0 0 15px 0; font-size: 14px;">Hoặc chuyển khoản thủ công:</p>
                        <p style="margin: 0 0 5px 0; font-size: 14px;"><strong>Ngân hàng:</strong> ${data.bankName}</p>
                        <p style="margin: 0 0 5px 0; font-size: 14px;"><strong>Số tài khoản:</strong> ${data.accountNo}</p>
                        <p style="margin: 0 0 5px 0; font-size: 14px;"><strong>Chủ tài khoản:</strong> ${data.accountName}</p>
                        <p style="margin: 15px 0 0 0; font-size: 14px; background: #fff7ed; padding: 10px; border: 1px solid #f97316;"><strong>Nội dung CK:</strong> ${data.transferContent}</p>
                    </div>
                    
                    <p style="font-size: 13px; color: #666; margin: 20px 0;">Sau khi thanh toán, hệ thống sẽ tự động xác nhận và mở khóa khóa học cho bạn trong vòng 1-2 phút.</p>
                    
                    <div style="margin: 30px 0; text-align: center;">
                        <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/order/${data.orderCode}" style="background-color: #000; color: #fff; padding: 14px 32px; text-decoration: none; font-size: 14px; font-weight: 500; display: inline-block;">
                            Xem chi tiết đơn hàng
                        </a>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0 20px 0;">
                    <p style="font-size: 12px; color: #999; margin: 0;">
                        © ${new Date().getFullYear()} The Tulie Lab. Học để làm được, không chỉ để biết.
                    </p>
                </div>
            </body>
            </html>
        `,
    }),
};

// Email sending functions
export const emailService = {
    async sendPasswordResetEmail(to: string, resetToken: string, userName?: string) {
        const resetLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
        const template = emailTemplates.passwordReset(resetLink, userName);

        try {
            const transporter = await getTransporter();
            const from = process.env.SMTP_FROM || process.env.SMTP_USER || '"Tulie Academy" <noreply@tulie.vn>';

            await transporter.sendMail({
                from,
                to,
                subject: template.subject,
                html: template.html,
            });
            console.log(`✅ Password reset email sent to ${to}`);
            return true;
        } catch (error) {
            console.error('❌ Error sending password reset email:', error);
            return false;
        }
    },

    async sendWelcomeEmail(to: string, userName: string) {
        const loginLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/courses`;
        const template = emailTemplates.welcomeEmail(userName, loginLink);

        try {
            const transporter = await getTransporter();
            const from = process.env.SMTP_FROM || process.env.SMTP_USER || '"Tulie Academy" <noreply@tulie.vn>';

            await transporter.sendMail({
                from,
                to,
                subject: template.subject,
                html: template.html,
            });
            console.log(`✅ Welcome email sent to ${to}`);
            return true;
        } catch (error) {
            console.error('❌ Error sending welcome email:', error);
            return false;
        }
    },

    async sendOrderConfirmationEmail(to: string, orderCode: string, amount: number, courses: string[]) {
        const paymentInfo = {
            bank: 'VietinBank',
            accountNumber: '104002106705',
            accountName: 'NGHIEM THI LIEN',
        };
        const template = emailTemplates.orderConfirmation(orderCode, amount, courses, paymentInfo);

        try {
            const transporter = await getTransporter();
            const from = process.env.SMTP_FROM || process.env.SMTP_USER || '"Tulie Academy" <noreply@tulie.vn>';

            await transporter.sendMail({
                from,
                to,
                subject: template.subject,
                html: template.html,
            });
            console.log(`✅ Order confirmation email sent to ${to}`);
            return true;
        } catch (error) {
            console.error('❌ Error sending order confirmation email:', error);
            return false;
        }
    },

    async sendBirthdayCouponEmail(to: string, userName: string, couponCode: string, discount: string) {
        const template = emailTemplates.birthdayCoupon(userName, couponCode, discount);
        try {
            const transporter = await getTransporter();
            const from = process.env.SMTP_FROM || process.env.SMTP_USER || '"Tulie Academy" <noreply@tulie.vn>';

            await transporter.sendMail({
                from,
                to,
                subject: template.subject,
                html: template.html,
            });
            console.log(`✅ Birthday coupon email sent to ${to}`);
            return true;
        } catch (error) {
            console.error('❌ Error sending birthday email:', error);
            return false;
        }
    },

    // Test email connection
    async verifyConnection() {
        try {
            const transporter = await getTransporter();
            await transporter.verify();
            console.log('✅ SMTP connection verified');
            return true;
        } catch (error) {
            console.error('❌ SMTP connection failed:', error);
            return false;
        }
    },

    async sendPaymentSuccessEmail(to: string, userName: string, orderCode: string, courses: string[]) {
        const template = emailTemplates.paymentSuccess(userName, orderCode, courses);
        try {
            const transporter = await getTransporter();
            const from = process.env.SMTP_FROM || process.env.SMTP_USER || '"The Tulie Lab" <noreply@tulie.vn>';

            await transporter.sendMail({
                from,
                to,
                subject: template.subject,
                html: template.html,
            });
            console.log(`✅ Payment success email sent to ${to}`);
            return true;
        } catch (error) {
            console.error('❌ Error sending payment success email:', error);
            return false;
        }
    },

    // Helper to get admin email from DB or env
    async getAdminEmail() {
        const setting = await prisma.systemSetting.findUnique({ where: { key: 'admin_notification_email' } });
        return setting?.value || process.env.ADMIN_NOTIFICATION_EMAIL;
    },

    async sendAdminContactNotification(submission: { name: string; email: string; phone?: string; message: string }) {
        const adminEmail = await this.getAdminEmail();
        if (!adminEmail) {
            console.warn('⚠️ ADMIN_NOTIFICATION_EMAIL not configured, skipping admin notification');
            return false;
        }
        const template = emailTemplates.adminNewContact(submission);
        try {
            const transporter = await getTransporter();
            const from = process.env.SMTP_FROM || process.env.SMTP_USER || '"The Tulie Lab" <noreply@tulie.vn>';

            await transporter.sendMail({
                from,
                to: adminEmail,
                subject: template.subject,
                html: template.html,
            });
            console.log(`✅ Admin contact notification sent to ${adminEmail}`);
            return true;
        } catch (error) {
            console.error('❌ Error sending admin contact notification:', error);
            return false;
        }
    },

    async sendAdminOrderNotification(orderCode: string, userEmail: string, courses: string[], amount: number) {
        const adminEmail = await this.getAdminEmail();
        if (!adminEmail) {
            console.warn('⚠️ ADMIN_NOTIFICATION_EMAIL not configured, skipping admin notification');
            return false;
        }
        const template = emailTemplates.adminNewOrder(orderCode, userEmail, courses, amount);
        try {
            const transporter = await getTransporter();
            const from = process.env.SMTP_FROM || process.env.SMTP_USER || '"The Tulie Lab" <noreply@tulie.vn>';

            await transporter.sendMail({
                from,
                to: adminEmail,
                subject: template.subject,
                html: template.html,
            });
            console.log(`✅ Admin order notification sent to ${adminEmail}`);
            return true;
        } catch (error) {
            console.error('❌ Error sending admin order notification:', error);
            return false;
        }
    },

    async sendPaymentReminderEmail(data: {
        to: string;
        userName: string;
        orderCode: string;
        amount: number;
        courses: string[];
        bankName: string;
        accountNo: string;
        accountName: string;
        transferContent: string;
        customMessage?: string;
        userId?: string;
        orderId?: string;
    }) {
        // Generate QR URL
        const qrUrl = `https://qr.sepay.vn/img?acc=${data.accountNo}&bank=${data.bankName}&amount=${data.amount}&des=${encodeURIComponent(data.transferContent)}`;

        const template = emailTemplates.paymentReminder({
            ...data,
            qrUrl
        });

        try {
            const transporter = await getTransporter();
            const from = process.env.SMTP_FROM || process.env.SMTP_USER || '"The Tulie Lab" <noreply@tulie.vn>';

            await transporter.sendMail({
                from,
                to: data.to,
                subject: template.subject,
                html: template.html,
            });
            console.log(`✅ Payment reminder email sent to ${data.to}`);

            // Log successful email
            await logEmail({
                to: data.to,
                subject: template.subject,
                type: 'payment_reminder',
                status: 'sent',
                ...(data.userId && { userId: data.userId }),
                ...(data.orderId && { orderId: data.orderId })
            });

            return true;
        } catch (error: any) {
            console.error('❌ Error sending payment reminder email:', error);

            // Log failed email
            await logEmail({
                to: data.to,
                subject: template.subject,
                type: 'payment_reminder',
                status: 'failed',
                ...(data.userId && { userId: data.userId }),
                ...(data.orderId && { orderId: data.orderId }),
                error: error?.message
            });

            return false;
        }
    },
};

export default emailService;
