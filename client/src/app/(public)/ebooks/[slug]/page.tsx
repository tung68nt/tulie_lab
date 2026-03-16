import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { EbookViewer } from '@/components/ebook/EbookViewer';

interface EbookPageProps {
    params: Promise<{
        slug: string;
    }>;
}

const BASE_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const API_BASE = BASE_URL.replace(/\/$/, '').replace(/\/api$/, '') + '/api';

// Fetch ebook details
async function getEbookData(slug: string) {
    try {
        const response = await fetch(`${API_BASE}/ebooks/${slug}`, { cache: 'no-store' });
        if (!response.ok) return null;
        const res = await response.json();
        return res.data || res;
    } catch (e) {
        return null;
    }
}

// Check access
async function checkEbookAccess(ebookId: string, token: string) {
    try {
        const response = await fetch(`${API_BASE}/ebooks/${ebookId}/access`, {
            cache: 'no-store',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) return null;
        const res = await response.json();
        return res.data || res;
    } catch (e) {
        return null;
    }
}

// Decode very basic info from JWT without library
function parseJwtPayload(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

export async function generateMetadata({ params }: EbookPageProps): Promise<Metadata> {
    const slug = (await params).slug;
    const ebook = await getEbookData(slug);

    if (!ebook) {
        return {
            title: 'Không tìm thấy Ebook',
        };
    }

    return {
        title: `${ebook.title} | Tulie Academy`,
        description: ebook.description || 'Đọc sách điện tử tại Tulie Academy.',
    };
}

export default async function EbookReaderPage({ params }: EbookPageProps) {
    const slug = (await params).slug;
    const cookieStore = cookies();
    const tokenCookie = (await cookieStore).get('token');
    const token = tokenCookie?.value;

    if (!token) {
        // Redirect to login if unauthenticated
        redirect(`/login?returnUrl=/ebooks/${slug}`);
    }

    const payload = parseJwtPayload(token);
    const userEmail = payload?.email || 'Student';

    const ebook = await getEbookData(slug);

    if (!ebook || !ebook.id) {
        notFound();
    }

    // Server-side layer security: Verify purchase and get the presigned URL
    const access = await checkEbookAccess(ebook.id, token);

    if (!access || !access.hasAccess) {
        // Render a no-access state or redirect to shop
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-muted w-24 h-24 rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <h1 className="text-3xl font-bold mb-4">Bạn chưa mở khóa Ebook này</h1>
                <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
                    Để đọc {ebook.title}, bạn cần mua sản phẩm này trong cửa hàng của chúng tôi.
                </p>
                <a href={`/shop/${ebook.slug}`} className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors inline-block">
                    Mua ngay
                </a>
            </div>
        );
    }

    // Render the ebook viewer if access is granted and we have a presigned PDF URL
    // (Note: The presigned URL is short-lived)
    return (
        <EbookViewer
            pdfUrl={access.presignedUrl}
            ebookId={ebook.id}
            title={ebook.title}
            userEmail={userEmail}
            description={ebook.description}
        />
    );
}
