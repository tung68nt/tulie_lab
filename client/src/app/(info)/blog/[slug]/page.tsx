'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { api } from '@/lib/api';
import { BottomCTA } from '@/components/BottomCTA';
import { Card, CardContent } from '@/components/Card';
import { useToast } from '@/contexts/ToastContext';
import { Clock, User, Calendar, ChevronRight, List, Loader2 } from 'lucide-react';
import { QuickEdit } from '@/components/admin/QuickEdit';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    thumbnail?: string;
    publishedAt?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    author?: {
        name: string;
        title?: string;
        avatar?: string;
    };
    category?: {
        id: string;
        name: string;
    };
}

interface TocItem {
    id: string;
    text: string;
    level: number;
}

export default function BlogPostPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [post, setPost] = useState<BlogPost | null>(null);
    const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [toc, setToc] = useState<TocItem[]>([]);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // Use API client for consistency
                const res: any = await api.blog.get(slug);
                const data = res.data;
                if (data) {
                    setPost(data);

                    // Extract TOC from markdown
                    extractToc(data.content);

                    // Update document title for SEO
                    if (data.metaTitle || data.title) {
                        document.title = `${data.metaTitle || data.title} | The Tulie Lab`;
                    }

                    // Fetch related posts (latest 3 excluding current)
                    const allPostsRes: any = await api.blog.list(1, 4);
                    const allPosts = allPostsRes.data || [];
                    setRelatedPosts(allPosts.filter((p: any) => p.slug !== slug).slice(0, 3));
                }
            } catch (error) {
                console.error('Error fetching post:', error);
            } finally {
                setLoading(false);
            }
        };
        if (slug) {
            fetchPost();
        }
    }, [slug]);

    const generateId = (text: string) => {
        return text.toLowerCase()
            .replace(/[đ/]/g, 'd')
            .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
            .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
            .replace(/[ìíịỉĩ]/g, 'i')
            .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
            .replace(/[ùúụủũưừứựửữ]/g, 'u')
            .replace(/[ỳýỵỷỹ]/g, 'y')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim();
    };

    const extractToc = (markdown: string) => {
        const lines = markdown.split('\n');
        const headings: TocItem[] = [];
        const headingRegex = /^(#{1,3})\s+(.+)$/;

        lines.forEach((line) => {
            const match = line.match(headingRegex);
            if (match) {
                const level = match[1].length;
                const text = match[2].trim();
                const id = generateId(text);
                headings.push({ id, text, level });
            }
        });
        setToc(headings);
    };

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsletterEmail || !newsletterEmail.includes('@')) {
            addToast('Vui lòng nhập email hợp lệ', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            // Updated to use the correct newsletter endpoint
            await api.newsletter.subscribe(newsletterEmail);
            addToast('Đăng ký bản tin thành công!', 'success');
            setNewsletterEmail('');
        } catch (error) {
            console.error('Newsletter error:', error);
            addToast('Có lỗi xảy ra, vui lòng thử lại sau', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Bài viết không tồn tại</h1>
                    <Link href="/blog" className="text-primary hover:underline">← Quay lại blog</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="scroll-smooth">
            <div className="min-h-screen bg-background">
                {/* Hero Section with Thumbnail */}
                <div className="bg-muted/30 border-b">
                    <div className="container py-8 md:py-16">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>

                            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mb-8">
                                {post.category && (
                                    <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg">
                                        {post.category.name}
                                    </div>
                                )}
                                {post.author && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                                            {post.author.avatar ? (
                                                <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-bold">
                                                    {post.author?.name?.charAt(0) || 'A'}
                                                </div>
                                            )}
                                        </div>
                                        <span className="font-medium text-foreground">{post.author.name}</span>
                                    </div>
                                )}
                                {post.publishedAt && (
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        <span>{new Date(post.publishedAt).toLocaleDateString('vi-VN', {
                                            day: '2-digit', month: '2-digit', year: 'numeric'
                                        })}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>~{Math.ceil(post.content.length / 1000) * 2} phút đọc</span>
                                </div>
                            </div>

                            {post.thumbnail && (
                                <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border bg-card">
                                    <img
                                        src={post.thumbnail}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="container py-12">
                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">

                        {/* Article Content */}
                        <div className="flex-1 max-w-4xl order-2 lg:order-1">
                            {post.excerpt && (
                                <p className="text-xl text-muted-foreground mb-10 border-l-4 border-primary pl-6 py-2 leading-relaxed">
                                    {post.excerpt}
                                </p>
                            )}

                            <article className="prose prose-zinc dark:prose-invert prose-lg md:prose-xl max-w-none 
                                prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:tracking-tight
                                prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
                                prose-img:rounded-xl prose-img:shadow-lg prose-img:border
                                prose-blockquote:border-l-primary prose-blockquote:font-medium
                                prose-a:text-primary prose-a:font-semibold">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        h1: ({ children }) => <h1 id={generateId(String(children))}>{children}</h1>,
                                        h2: ({ children }) => <h2 id={generateId(String(children))}>{children}</h2>,
                                        h3: ({ children }) => <h3 id={generateId(String(children))}>{children}</h3>,
                                    }}
                                >
                                    {post.content}
                                </ReactMarkdown>
                            </article>

                            {/* Author Box */}
                            <div className="mt-16 p-8 rounded-2xl bg-muted/30 border border-border flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                                <div className="w-20 h-20 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                                    {post.author?.avatar ? (
                                        <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                                            {post.author?.name?.charAt(0) || 'A'}
                                        </div>
                                    )}
                                </div>
                                <div className="text-center sm:text-left">
                                    <h3 className="text-xl font-bold mb-1">{post.author?.name}</h3>
                                    <p className="text-sm text-primary font-medium mb-3">{post.author?.title || 'Chuyên gia AI & Automation'}</p>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        Chia sẻ những kiến thức mới nhất về trí tuệ nhân tạo và cách áp dụng chúng vào thực tiễn để tăng hiệu suất công việc.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="w-full lg:w-80 order-1 lg:order-2">
                            <div className="sticky top-24 space-y-8">
                                {/* TOC */}
                                {toc.length > 0 && (
                                    <div className="p-6 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm">
                                        <div className="flex items-center gap-2 font-bold mb-4">
                                            <List size={18} />
                                            <span>Mục lục bài viết</span>
                                        </div>
                                        <nav className="space-y-1">
                                            {toc.map((item, idx) => (
                                                <a
                                                    key={idx}
                                                    href={`#${item.id}`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        document.getElementById(item.id)?.scrollIntoView({
                                                            behavior: 'smooth',
                                                            block: 'start'
                                                        });
                                                    }}
                                                    className={`block py-1.5 text-sm transition-colors hover:text-primary cursor-pointer
                                                        ${item.level === 1 ? 'font-semibold' :
                                                            item.level === 2 ? 'pl-4 text-muted-foreground' :
                                                                'pl-8 text-muted-foreground opacity-80'}
                                                    `}
                                                >
                                                    {item.text}
                                                </a>
                                            ))}
                                        </nav>
                                    </div>
                                )}

                                {/* Newsletter or Call to Action */}
                                <div className="p-6 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 border shadow-lg">
                                    <h4 className="font-bold mb-2">Đăng ký bản tin AI</h4>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-600 mb-4">
                                        Nhận ngay các bí quyết Vibe Coding và AI Automation hàng tuần.
                                    </p>
                                    <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                                        <input
                                            type="email"
                                            value={newsletterEmail}
                                            onChange={(e) => setNewsletterEmail(e.target.value)}
                                            placeholder="Email của bạn"
                                            className="flex-1 h-9 rounded-lg bg-zinc-800 dark:bg-zinc-200 border-none px-3 text-xs focus:ring-1 focus:ring-primary text-zinc-100 dark:text-zinc-900"
                                            required
                                        />
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-bold whitespace-nowrap flex items-center justify-center disabled:opacity-70"
                                        >
                                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Gửi'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <div className="bg-muted/10 border-t py-16 md:py-24">
                        <div className="container">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-2xl md:text-3xl font-bold">Bài viết liên quan</h2>
                                <Link href="/blog" className="text-sm font-medium hover:text-primary flex items-center gap-1">
                                    Xem tất cả blog <ChevronRight size={14} />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {relatedPosts.map((post) => (
                                    <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                                        <Card className="h-full border-none bg-transparent hover:shadow-none transition-none">
                                            <div className="aspect-video bg-muted rounded-xl mb-4 overflow-hidden border">
                                                {post.thumbnail && (
                                                    <img
                                                        src={post.thumbnail}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="font-bold group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                                                <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                                                <div className="pt-2 flex items-center gap-2 text-xs font-medium text-primary">
                                                    Đọc thêm <ChevronRight size={12} />
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <BottomCTA
                title="Sẵn sàng áp dụng AI vào quy trình?"
                subtitle="Đăng ký khóa học ngay hôm nay để nhận được lộ trình Automation bài bản."
                buttonText="Tìm hiểu khóa học"
                buttonHref="/courses"
            />
            {post && <QuickEdit editUrl={`/admin/blog/${post.id}`} />}
        </div>
    );
}
