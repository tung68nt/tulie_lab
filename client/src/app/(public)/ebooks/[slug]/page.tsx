import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { EbookViewer } from '@/components/ebook/EbookViewer';
import { serverApi } from '@/lib/server-api';

interface EbookPageProps {
    params: {
        slug: string;
    };
}

// Fetch ebook details
async function getEbookData(slug: string) {
    try {
        const ebook = await serverApi.get(`/ebooks/${slug}`);
        return ebook as any; // Temporary any
    } catch (e) {
        return null;
    }
}

// Check access
async function checkEbookAccess(ebookId: string) {
    try {
        const access = await serverApi.get(`/ebooks/${ebookId}/access`);
        return access as any;
    } catch (e) {
        return null;
    }
}

export async function generateMetadata({ params }: EbookPageProps): Promise<Metadata> {
    const ebook = await getEbookData(params.slug);

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
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        // Redirect to login if unauthenticated
        redirect(`/login?callbackUrl=/ebooks/${params.slug}`);
    }

    const ebook = await getEbookData(params.slug);

    if (!ebook) {
        notFound();
    }

    // Server-side layer security: Verify purchase and get the presigned URL
    const access = await checkEbookAccess(ebook.id);

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
            userEmail={session.user.email!}
            description={ebook.description}
        />
    );
}
