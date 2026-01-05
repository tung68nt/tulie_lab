'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { Button } from '@/components/Button';
import { Pagination } from '@/components/Pagination';
import Link from 'next/link';
import { useToast } from '@/contexts/ToastContext';

export default function AdminCoursesPage() {
    const { addToast } = useToast();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Pagination
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 20;

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Fetch all courses (including unpublished ones if the API supports it)
                const data = await api.admin.courses.list() as any[];
                setCourses(data);
            } catch (e) {
                console.warn('Failed to fetch courses (Admin)', e);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this course?')) return;
        try {
            await api.admin.courses.delete(id);
            setCourses(courses.filter(c => c.id !== id));
        } catch (e) {
            console.error('Failed to delete course', e);
            addToast('Xóa khóa học thất bại', 'error');
        }
    };

    // Pagination Logic
    const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);
    const paginatedCourses = courses.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Quản lý khóa học</h1>
                <Link href="/admin/courses/new">
                    <Button>Tạo khóa học</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách khóa học ({courses.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Tên khóa học</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Đường dẫn (Slug)</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Giá</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Trạng thái</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {paginatedCourses.map((course) => (
                                    <tr key={course.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle font-medium">{course.title}</td>
                                        <td className="p-4 align-middle">{course.slug}</td>
                                        <td className="p-4 align-middle font-medium text-right">
                                            {course.price === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${course.isPublished ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}>
                                                {course.isPublished ? 'Live' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/courses/${course.id}`}>
                                                    <Button variant="outline" size="sm">Sửa</Button>
                                                </Link>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="bg-muted text-foreground hover:bg-muted/80"
                                                    onClick={() => handleDelete(course.id)}
                                                >
                                                    Xóa
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {courses.length === 0 && !loading && (
                            <div className="p-4 text-center text-muted-foreground">Chưa có khóa học nào. Hãy tạo mới ngay!</div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="mt-4">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
