'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { SectionTag } from '@/components/SectionTag';
import { BookOpen, Clock, ChevronRight, Sparkles, TrendingUp } from 'lucide-react';

export default function CombosListPage() {
    const [combos, setCombos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCombos = async () => {
            try {
                const data: any = await api.bundles.list();
                setCombos(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to fetch combos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCombos();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 bg-background flex flex-col items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
                <p className="text-muted-foreground animate-pulse">Đang tải các lộ trình học tập...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-20 bg-background relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:24px_24px] opacity-10 -z-10" />

            <div className="container relative z-10">
                {/* Header Section */}
                <div className="max-w-3xl mx-auto text-center mb-20 space-y-6">
                    <SectionTag>Learning Paths</SectionTag>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        Lộ trình học tập Chuyên sâu
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Tiết kiệm thời gian và chi phí với các bộ combo khóa học được thiết kế bài bản,
                        giúp bạn làm chủ kiến thức từ con số 0 đến cấp độ chuyên gia.
                    </p>
                </div>

                {/* Combos Grid */}
                {combos.length === 0 ? (
                    <div className="text-center py-20 bg-card/30 border-2 border-dashed rounded-[3rem]">
                        <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
                        <h3 className="text-xl font-bold mb-2">Chưa có lộ trình nào</h3>
                        <p className="text-muted-foreground">Vui lòng quay lại sau để cập nhật các lộ trình học tập mới nhất.</p>
                        <Link href="/courses" className="mt-8 block">
                            <Button variant="outline">Xem tất cả khóa học</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {combos.map((combo) => (
                            <div key={combo.id} className="group relative bg-card border rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 flex flex-col">
                                <Link href={`/combos/${combo.slug}`} className="absolute inset-0 z-10" />

                                <div className="flex flex-col md:flex-row h-full">
                                    {/* Image Side */}
                                    <div className="w-full md:w-2/5 aspect-[4/3] md:aspect-auto relative overflow-hidden bg-zinc-100">
                                        <img
                                            src={combo.thumbnail || '/placeholder-combo.jpg'}
                                            alt={combo.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-white/90 backdrop-blur-md text-black border-none py-1.5 px-3 text-[10px] font-bold uppercase tracking-wider shadow-xl">
                                                -{combo.discountPercent}% OFF
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Content Side */}
                                    <div className="flex-1 p-8 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                                    <TrendingUp className="w-4 h-4" />
                                                </div>
                                                <span className="text-xs font-bold text-primary uppercase tracking-widest">Combo Ưu đãi</span>
                                            </div>
                                            <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight">
                                                {combo.name}
                                            </h3>
                                            <p className="text-muted-foreground text-sm line-clamp-3 mb-6 leading-relaxed">
                                                {combo.description}
                                            </p>

                                            <div className="space-y-3 mb-8">
                                                <div className="flex items-center gap-3 text-xs font-medium text-zinc-500">
                                                    <BookOpen className="w-4 h-4 text-zinc-400" />
                                                    <span>{combo.courses?.length || 0} Khóa học chuyên sâu</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs font-medium text-zinc-500">
                                                    <Clock className="w-4 h-4 text-zinc-400" />
                                                    <span>Học tập theo lộ trình bài bản</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-6 border-t border-border/50">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-muted-foreground line-through font-medium">
                                                    {combo.originalPrice?.toLocaleString()}₫
                                                </span>
                                                <span className="text-2xl font-bold text-foreground">
                                                    {combo.salePrice?.toLocaleString()}₫
                                                </span>
                                            </div>
                                            <div className="w-12 h-12 rounded-2xl bg-zinc-900 group-hover:bg-primary text-white flex items-center justify-center transition-all duration-300">
                                                <ChevronRight className="w-6 h-6" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Benefits Section */}
                <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        {
                            icon: <Sparkles className="w-6 h-6" />,
                            title: "Tiết kiệm tối đa",
                            description: "Sở hữu trọn bộ kiến thức với mức giá ưu đãi hơn 50% so với mua lẻ từng khóa."
                        },
                        {
                            icon: <BookOpen className="w-6 h-6" />,
                            title: "Lộ trình bài bản",
                            description: "Không còn mông lung, các khóa học được sắp xếp theo trình tự học tập tối ưu nhất."
                        },
                        {
                            icon: <Clock className="w-6 h-6" />,
                            title: "Hỗ trợ 1-1",
                            description: "Được ưu tiên hỗ trợ trực tiếp từ đội ngũ giảng viên và chuyên gia tại Tulie Academy."
                        }
                    ].map((benefit, i) => (
                        <div key={i} className="space-y-4 p-8 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900/50 border border-transparent hover:border-border transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                {benefit.icon}
                            </div>
                            <h4 className="text-xl font-bold">{benefit.title}</h4>
                            <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
