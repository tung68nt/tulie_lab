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
        <div className="min-h-screen bg-background">
            {/* Redesigned Dark Hero Header Section */}
            <div className="relative bg-[#050505] pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden">
                {/* Immersive Ambient Effects */}
                <div className="absolute top-[-10%] right-[-5%] w-[1000px] h-[1000px] bg-primary/20 rounded-full blur-[180px] -z-10 opacity-70 animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[160px] -z-10 opacity-50" />
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-[0.05] [background-size:40px_40px] -z-10" />

                <div className="px-4 md:px-10 lg:px-16 w-full max-w-[1200px] mx-auto relative z-10">
                    <div className="max-w-4xl space-y-10 text-left">
                        <SectionTag>
                            Combo lộ trình chuyên sâu
                        </SectionTag>

                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.95] text-white animate-fade-up">
                            Lộ trình học tập <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-primary/80">Chuyên sâu</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed font-medium max-w-2xl animate-fade-up delay-100">
                            Tiết kiệm thời gian và chi phí với các bộ combo khóa học được thiết kế bài bản,
                            giúp bạn làm chủ kiến thức từ con số 0 đến cấp độ chuyên gia.
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-4 md:px-10 lg:px-16 w-full max-w-[1200px] mx-auto py-24 relative z-10">
                {/* Combos List (1 Column) */}
                {combos.length === 0 ? (
                    <div className="text-center py-24 bg-zinc-50 dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem] w-full max-w-4xl mx-auto">
                        <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
                        <h3 className="text-xl font-bold mb-2">Chưa có lộ trình nào</h3>
                        <p className="text-muted-foreground">Vui lòng quay lại sau để cập nhật các lộ trình mới nhất.</p>
                        <Link href="/courses" className="mt-8 block">
                            <Button variant="outline">Xem tất cả khóa học</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-10 max-w-[1050px] mx-auto">
                        {combos.map((combo) => (
                            <div key={combo.id} className="group relative bg-card border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col md:flex-row hover:-translate-y-1">
                                <Link href={`/combos/${combo.slug}`} className="absolute inset-0 z-10" />

                                {/* Image Side - Horizontal aspect */}
                                <div className="w-full md:w-[38%] relative overflow-hidden bg-zinc-100 min-h-[240px] md:min-h-full">
                                    <img
                                        src={combo.thumbnail || '/placeholder-combo.jpg'}
                                        alt={combo.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                    />
                                    <div className="absolute top-6 left-6">
                                        <div className="bg-red-500 text-white px-4 py-1.5 rounded-xl text-[11px] font-bold shadow-xl border border-white/20">
                                            -{combo.discountPercent}% tiết kiệm
                                        </div>
                                    </div>
                                </div>

                                {/* Content Side */}
                                <div className="flex-1 p-8 md:p-12 flex flex-col justify-between overflow-hidden">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                                <TrendingUp className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-bold text-primary">Combo ưu đãi đặc biệt</span>
                                        </div>

                                        <h3 className="text-3xl md:text-4xl font-bold group-hover:text-primary transition-all leading-tight tracking-tight">
                                            {combo.name}
                                        </h3>

                                        <p className="text-muted-foreground text-sm md:text-base line-clamp-2 leading-relaxed font-medium opacity-80">
                                            {combo.description}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-zinc-500 pt-2">
                                            <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 rounded-xl">
                                                <BookOpen className="w-4 h-4 text-zinc-400" />
                                                <span>{combo.courses?.length || 0} Khóa học chuyên sâu</span>
                                            </div>
                                            <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 rounded-xl">
                                                <Clock className="w-4 h-4 text-zinc-400" />
                                                <span>Lộ trình bài bản 1:1</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-10 mt-8 border-t border-zinc-100 dark:border-zinc-800">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-zinc-400 line-through font-bold opacity-50 mb-1">
                                                {combo.originalPrice?.toLocaleString()}₫
                                            </span>
                                            <div className="flex items-center gap-4">
                                                <span className="text-3xl md:text-4xl font-bold text-foreground tracking-tighter">
                                                    {combo.salePrice?.toLocaleString()}₫
                                                </span>
                                                <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[11px] font-bold py-1.5 px-3 rounded-xl border border-red-100 dark:border-red-500/20">
                                                    Tiết kiệm {Math.round((1 - combo.salePrice / (combo.originalPrice || 1)) * 100)}%
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="h-12 px-6 rounded-2xl bg-zinc-950 dark:bg-zinc-800 group-hover:bg-primary text-white flex items-center justify-center gap-2 transition-all duration-300 shadow-xl group-hover:shadow-primary/20 group-hover:scale-105 active:scale-95 text-sm font-bold">
                                                <span>Xem chi tiết</span>
                                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Benefits Section */}
                <div className="mt-48 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Sparkles className="w-6 h-6" />,
                            title: "Tiết kiệm tối đa",
                            description: "Sở hữu trọn bộ kiến thức với mức giá ưu đãi hơn 50% so với mua lẻ từng khóa học lẻ."
                        },
                        {
                            icon: <BookOpen className="w-6 h-6" />,
                            title: "Lộ trình bài bản",
                            description: "Không còn mông lung, các khóa học được sắp xếp theo trình tự học tập tối ưu nhất hiện nay."
                        },
                        {
                            icon: <Clock className="w-6 h-6" />,
                            title: "Hỗ trợ 1:1",
                            description: "Được ưu tiên hỗ trợ trực tiếp từ đội ngũ giảng viên và các chuyên gia tại Tulie Academy."
                        }
                    ].map((benefit, i) => (
                        <div key={i} className="group p-10 rounded-[3rem] bg-zinc-50 dark:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8 border border-primary/5 group-hover:scale-110 transition-transform">
                                {benefit.icon}
                            </div>
                            <h4 className="text-2xl font-bold mb-4">{benefit.title}</h4>
                            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
