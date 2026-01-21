'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { ArrowUp, ArrowDown, Trash2, Plus, Save, ExternalLink, ChevronRight, GripVertical } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

interface MenuItem {
    id: string;
    label: string;
    href: string;
    isExternal?: boolean;
    children?: MenuItem[];
}

const DEFAULT_MENU: MenuItem[] = [
    { id: 'home', label: 'Trang chủ', href: '/' },
    {
        id: 'apps',
        label: 'Ứng dụng',
        href: '#',
        children: [
            { id: 'ai', label: 'Ứng dụng AI', href: '/ai' },
            { id: 'vibe-coding', label: 'Vibe Coding', href: '/vibe-coding' },
            { id: 'google-sheets', label: 'Google Sheets', href: '/google-sheets' },
        ]
    },
    { id: 'courses', label: 'Khóa học', href: '/courses' },
    { id: 'templates', label: 'Kho template', href: '/shop' },
    { id: 'blog', label: 'Bài viết', href: '/blog' },
    { id: 'contact', label: 'Liên hệ', href: '/contact' },
];

export default function MenuManagementPage() {
    const { addToast } = useToast();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state for adding new item
    const [newItem, setNewItem] = useState({ label: '', href: '', isExternal: false });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ label: '', href: '', isExternal: false });

    useEffect(() => {
        loadMenu();
    }, []);

    const loadMenu = async () => {
        try {
            const data = await api.cms.get(['navbar_menu']) as any;
            if (data?.navbar_menu) {
                const parsed = JSON.parse(data.navbar_menu);
                setMenuItems(parsed);
            } else {
                setMenuItems(DEFAULT_MENU);
            }
        } catch (error) {
            console.error('Failed to load menu', error);
            setMenuItems(DEFAULT_MENU);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.admin.cms.update({
                key: 'navbar_menu',
                value: JSON.stringify(menuItems),
                type: 'json'
            });
            addToast('Đã lưu cấu hình menu', 'success');
        } catch (error) {
            console.error('Save failed', error);
            addToast('Lưu thất bại', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newItems = [...menuItems];
        if (direction === 'up' && index > 0) {
            [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
        } else if (direction === 'down' && index < newItems.length - 1) {
            [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
        }
        setMenuItems(newItems);
    };

    const handleDelete = (id: string) => {
        if (!confirm('Xóa menu item này?')) return;
        setMenuItems(menuItems.filter(item => item.id !== id));
    };

    const handleAddItem = () => {
        if (!newItem.label || !newItem.href) {
            addToast('Vui lòng nhập đầy đủ thông tin', 'error');
            return;
        }
        const newMenuItem: MenuItem = {
            id: `menu-${Date.now()}`,
            label: newItem.label,
            href: newItem.href,
            isExternal: newItem.isExternal
        };
        setMenuItems([...menuItems, newMenuItem]);
        setNewItem({ label: '', href: '', isExternal: false });
        addToast('Đã thêm menu item', 'success');
    };

    const handleStartEdit = (item: MenuItem) => {
        setEditingId(item.id);
        setEditForm({ label: item.label, href: item.href, isExternal: item.isExternal || false });
    };

    const handleSaveEdit = (id: string) => {
        setMenuItems(menuItems.map(item =>
            item.id === id
                ? { ...item, label: editForm.label, href: editForm.href, isExternal: editForm.isExternal }
                : item
        ));
        setEditingId(null);
        addToast('Đã cập nhật', 'success');
    };

    const handleAddSubmenu = (parentId: string) => {
        const label = prompt('Tên submenu:');
        const href = prompt('Đường dẫn (VD: /ai):');
        if (!label || !href) return;

        setMenuItems(menuItems.map(item => {
            if (item.id === parentId) {
                const children = item.children || [];
                return {
                    ...item,
                    children: [...children, { id: `sub-${Date.now()}`, label, href }]
                };
            }
            return item;
        }));
    };

    const handleDeleteSubmenu = (parentId: string, subId: string) => {
        setMenuItems(menuItems.map(item => {
            if (item.id === parentId && item.children) {
                return { ...item, children: item.children.filter(c => c.id !== subId) };
            }
            return item;
        }));
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="space-y-6 max-w-4xl">
            <AdminPageHeader
                title="Quản lý Menu Navbar"
                subtitle="Thêm, xóa, sắp xếp các mục menu trên thanh điều hướng"
                backUrl="/admin/settings"
            >
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                    <Save size={16} />
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
            </AdminPageHeader>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách Menu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {menuItems.map((item, index) => (
                        <div key={item.id} className="space-y-2">
                            <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border">
                                <GripVertical size={16} className="text-muted-foreground" />

                                {editingId === item.id ? (
                                    <div className="flex-1 flex items-center gap-2">
                                        <input
                                            className="flex-1 h-9 px-3 rounded border text-sm"
                                            value={editForm.label}
                                            onChange={e => setEditForm({ ...editForm, label: e.target.value })}
                                            placeholder="Tên hiển thị"
                                        />
                                        <input
                                            className="flex-1 h-9 px-3 rounded border text-sm"
                                            value={editForm.href}
                                            onChange={e => setEditForm({ ...editForm, href: e.target.value })}
                                            placeholder="Đường dẫn"
                                        />
                                        <label className="flex items-center gap-1 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={editForm.isExternal}
                                                onChange={e => setEditForm({ ...editForm, isExternal: e.target.checked })}
                                            />
                                            <ExternalLink size={12} />
                                        </label>
                                        <Button size="sm" onClick={() => handleSaveEdit(item.id)}>Lưu</Button>
                                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Hủy</Button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex-1">
                                            <div className="font-medium flex items-center gap-2">
                                                {item.label}
                                                {item.isExternal && <ExternalLink size={12} className="text-muted-foreground" />}
                                                {item.children && item.children.length > 0 && (
                                                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                                        {item.children.length} submenu
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm text-muted-foreground">{item.href}</div>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <Button size="icon" variant="ghost" className="h-8 w-8" disabled={index === 0} onClick={() => handleMove(index, 'up')}>
                                                <ArrowUp size={14} />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8" disabled={index === menuItems.length - 1} onClick={() => handleMove(index, 'down')}>
                                                <ArrowDown size={14} />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleStartEdit(item)}>
                                                ✏️
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAddSubmenu(item.id)} title="Thêm submenu">
                                                <ChevronRight size={14} />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Submenu items */}
                            {item.children && item.children.length > 0 && (
                                <div className="ml-8 space-y-1">
                                    {item.children.map(child => (
                                        <div key={child.id} className="flex items-center gap-2 p-2 bg-background rounded border text-sm">
                                            <ChevronRight size={12} className="text-muted-foreground" />
                                            <span className="flex-1">{child.label}</span>
                                            <span className="text-muted-foreground">{child.href}</span>
                                            <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500" onClick={() => handleDeleteSubmenu(item.id, child.id)}>
                                                <Trash2 size={12} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Thêm Menu Mới</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end gap-4">
                        <div className="flex-1 space-y-2">
                            <label className="text-sm font-medium">Tên hiển thị</label>
                            <input
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={newItem.label}
                                onChange={e => setNewItem({ ...newItem, label: e.target.value })}
                                placeholder="VD: Về chúng tôi"
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <label className="text-sm font-medium">Đường dẫn</label>
                            <input
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={newItem.href}
                                onChange={e => setNewItem({ ...newItem, href: e.target.value })}
                                placeholder="VD: /about hoặc https://..."
                            />
                        </div>
                        <label className="flex items-center gap-2 pb-2">
                            <input
                                type="checkbox"
                                checked={newItem.isExternal}
                                onChange={e => setNewItem({ ...newItem, isExternal: e.target.checked })}
                            />
                            <span className="text-sm">External</span>
                        </label>
                        <Button onClick={handleAddItem} className="gap-2">
                            <Plus size={16} /> Thêm
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
