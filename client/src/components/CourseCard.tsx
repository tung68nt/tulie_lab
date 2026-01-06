import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from './Card';
import { Button } from './Button';

interface CourseCardProps {
    title: string;
    slug: string;
    description: string;
    price: number;
    thumbnail?: string;
    deploymentStatus?: 'RELEASED' | 'COMING_SOON' | 'UPDATING';
}

export function CourseCard({ title, slug, description, price, thumbnail, deploymentStatus = 'RELEASED' }: CourseCardProps) {
    return (
        <Link href={`/courses/${slug}`} className="group block h-full">
            <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800">
                <div className="relative aspect-video w-full overflow-hidden bg-muted rounded-t-xl">
                    {thumbnail ? (
                        <img
                            src={thumbnail}
                            alt={title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                            <span className="text-4xl text-zinc-300">—</span>
                        </div>
                    )}
                    {price === 0 && deploymentStatus === 'RELEASED' && (
                        <div className="absolute right-3 top-3 rounded-full bg-foreground px-3 py-1 text-xs font-bold text-background backdrop-blur-sm">
                            MIỄN PHÍ
                        </div>
                    )}
                    {(deploymentStatus === 'COMING_SOON' || deploymentStatus === 'UPDATING') && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-950/70 backdrop-blur-[1px] transition-colors group-hover:bg-zinc-950/60">
                            <span className="border border-white/80 bg-black/30 px-6 py-2.5 text-sm font-bold tracking-wider text-white backdrop-blur-md">
                                {deploymentStatus === 'COMING_SOON' ? 'SẮP RA MẮT' : 'ĐANG CẬP NHẬT'}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                    <h3 className="mb-2 line-clamp-2 font-heading text-xl font-bold group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                        {description}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                        <div className="flex flex-col">
                            {price > 0 ? (
                                <>
                                    <span className="text-xs text-muted-foreground tracking-wider font-semibold">Giá</span>
                                    <span className="text-lg font-bold text-primary">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
                                    </span>
                                </>
                            ) : (
                                <span className="text-lg font-bold text-foreground">Truy cập miễn phí</span>
                            )}
                        </div>
                        <Button variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            Xem chi tiết
                        </Button>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
