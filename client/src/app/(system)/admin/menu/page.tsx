'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { ArrowUp, ArrowDown, Trash2, Plus, Save, ExternalLink, ChevronRight, GripVertical, Edit, Check, X } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { Switch } from '@/components/Switch';
import { useConfirm } from '@/components/ConfirmDialog';

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
        href: '/applications',
        children: [
            { id: 'vibe-coding', label: 'Vibe Coding', href: '/applications/vibe-coding' },
            { id: 'ai', label: 'Ứng dụng AI', href: '/applications/ai' },
            { id: 'google-sheets', label: 'Google Sheets & Apps Script', href: '/applications/google-sheets' },
        ]
    },
    {
        id: 'courses',
        label: 'Khoá học',
        href: '/courses',
        children: [
            { id: 'courses-list', label: 'Khoá học', href: '/courses' },
            { id: 'calendar', label: 'Lịch hoạt động', href: '/calendar' },
            { id: 'instructors', label: 'Người hướng dẫn', href: '/instructors' },
        ],
    },
    {
        id: 'shop',
        label: 'Kho template',
        href: '/shop',
        children: [
            { id: 'shop-list', label: 'Cửa hàng', href: '/shop' },
            { id: 'pricing', label: 'Bảng giá', href: '/pricing' },
        ],
    },
    { id: 'blog', label: 'Bài viết', href: '/blog' },
    { id: 'contact', label: 'Liên hệ', href: '/contact' },
];

export default function MenuManagementPage() {
    const { addToast } = useToast();
    const confirm = useConfirm();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state for adding new item
    const [newItem, setNewItem] = useState({ label: '', href: '', isExternal: false });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ label: '', href: '', isExternal: false });

    // Submenu editing state
    const [editingSubmenu, setEditingSubmenu] = useState<{ parentId: string; childId: string } | null>(null);
    const [submenuEditForm, setSubmenuEditForm] = useState({ label: '', href: '' });

    // Submenu Modal State
    const [submenuModal, setSubmenuModal] = useState<{
        open: boolean;
        parentId: string | null;
        label: string;
        href: string;
    }>({ open: false, parentId: null, label: '', href: '' });

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

    const handleDelete = async (id: string) => {
        const isConfirmed = await confirm({
            title: 'Xóa Menu Item',
            message: 'Bạn có chắc chắn muốn xóa mục menu này? Hành động này không thể hoàn tác.',
            confirmText: 'Xóa',
            variant: 'danger'
        });

        if (isConfirmed) {
            setMenuItems(menuItems.filter(item => item.id !== id));
            addToast('Đã xóa menu item', 'success');
        }
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

    const openSubmenuModal = (parentId: string) => {
        setSubmenuModal({ open: true, parentId, label: '', href: '' });
    };

    const handleAddSubmenu = () => {
        const { parentId, label, href } = submenuModal;
        if (!parentId || !label || !href) {
            addToast('Vui lòng nhập đầy đủ tên và đường dẫn', 'error');
            return;
        }

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

        setSubmenuModal({ open: false, parentId: null, label: '', href: '' });
        addToast('Đã thêm submenu', 'success');
    };

    const handleDeleteSubmenu = async (parentId: string, subId: string) => {
        const isConfirmed = await confirm({
            title: 'Xóa Submenu',
            message: 'Bạn có chắc chắn muốn xóa submenu này?',
            confirmText: 'Xóa',
            variant: 'danger'
        });

        if (isConfirmed) {
            setMenuItems(menuItems.map(item => {
                if (item.id === parentId && item.children) {
                    return { ...item, children: item.children.filter(c => c.id !== subId) };
                }
                return item;
            }));
            addToast('Đã xóa submenu', 'success');
        }
    };

    const handleStartEditSubmenu = (parentId: string, child: MenuItem) => {
        setEditingSubmenu({ parentId, childId: child.id });
        setSubmenuEditForm({ label: child.label, href: child.href });
    };

    const handleSaveSubmenuEdit = (parentId: string, childId: string) => {
        setMenuItems(menuItems.map(item => {
            if (item.id === parentId && item.children) {
                return {
                    ...item,
                    children: item.children.map(c =>
                        c.id === childId
                            ? { ...c, label: submenuEditForm.label, href: submenuEditForm.href }
                            : c
                    )
                };
            }
            return item;
        }));
        setEditingSubmenu(null);
        addToast('Đã cập nhật submenu', 'success');
    };

    const handleCancelSubmenuEdit = () => {
        setEditingSubmenu(null);
        setSubmenuEditForm({ label: '', href: '' });
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="space-y-6 max-w-4xl relative">
            <AdminPageHeader
                title="Quản lý Menu Navbar"
                subtitle="Thêm, xóa, sắp xếp các mục menu trên thanh điều hướng"
                backUrl="/admin"
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

                                        <div className="flex items-center gap-2 px-2 py-1 bg-background border rounded">
                                            <span className="text-xs font-medium">External</span>
                                            <Switch
                                                checked={editForm.isExternal}
                                                onChange={(checked) => setEditForm({ ...editForm, isExternal: checked })}
                                            />
                                        </div>

                                        <Button size="sm" onClick={() => handleSaveEdit(item.id)}>
                                            <Check size={14} />
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Hủy</Button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex-1">
                                            <div className="font-medium flex items-center gap-2">
                                                {item.label}
                                                {item.isExternal && (
                                                    <span className="flex items-center text-[10px] bg-muted border px-1.5 py-0.5 rounded text-muted-foreground">
                                                        <ExternalLink size={8} className="mr-1" /> External
                                                    </span>
                                                )}
                                                {item.children && item.children.length > 0 && (
                                                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                                        {item.children.length} submenu
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm text-muted-foreground">{item.href}</div>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="h-8 w-8 p-0 rounded-lg bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors"
                                                disabled={index === 0}
                                                onClick={() => handleMove(index, 'up')}
                                                title="Lên trên"
                                            >
                                                <ArrowUp size={16} className="text-muted-foreground hover:text-foreground" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="h-8 w-8 p-0 rounded-lg bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors"
                                                disabled={index === menuItems.length - 1}
                                                onClick={() => handleMove(index, 'down')}
                                                title="Xuống dưới"
                                            >
                                                <ArrowDown size={16} className="text-muted-foreground hover:text-foreground" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="h-8 w-8 p-0 rounded-lg bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors"
                                                onClick={() => handleStartEdit(item)}
                                                title="Chỉnh sửa"
                                            >
                                                <Edit size={16} className="text-muted-foreground hover:text-foreground" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="h-8 w-8 p-0 rounded-lg bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors"
                                                onClick={() => openSubmenuModal(item.id)}
                                                title="Thêm submenu"
                                            >
                                                <Plus size={16} className="text-muted-foreground hover:text-foreground" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="h-8 w-8 p-0 rounded-lg bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors"
                                                onClick={() => handleDelete(item.id)}
                                                title="Xóa"
                                            >
                                                <Trash2 size={16} className="text-muted-foreground hover:text-foreground" />
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Submenu items */}
                            {item.children && item.children.length > 0 && (
                                <div className="ml-8 space-y-1">
                                    {item.children.map(child => {
                                        const isEditingThisSubmenu = editingSubmenu?.parentId === item.id && editingSubmenu?.childId === child.id;

                                        return (
                                            <div key={child.id} className="flex items-center gap-2 p-2 bg-background rounded border text-sm">
                                                <div className="w-1 h-1 rounded-full bg-muted-foreground/30 ml-1 mr-2"></div>

                                                {isEditingThisSubmenu ? (
                                                    <>
                                                        <input
                                                            className="flex-1 h-8 px-2 rounded border text-sm"
                                                            value={submenuEditForm.label}
                                                            onChange={e => setSubmenuEditForm({ ...submenuEditForm, label: e.target.value })}
                                                            placeholder="Tên hiển thị"
                                                        />
                                                        <input
                                                            className="flex-1 h-8 px-2 rounded border text-sm"
                                                            value={submenuEditForm.href}
                                                            onChange={e => setSubmenuEditForm({ ...submenuEditForm, href: e.target.value })}
                                                            placeholder="Đường dẫn"
                                                        />
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => handleSaveSubmenuEdit(item.id, child.id)}
                                                        >
                                                            <Check size={14} />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0"
                                                            onClick={handleCancelSubmenuEdit}
                                                        >
                                                            <X size={14} />
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="flex-1">{child.label}</span>
                                                        <span className="text-muted-foreground text-xs">{child.href}</span>
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            className="h-8 w-8 p-0 rounded-lg bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors"
                                                            onClick={() => handleStartEditSubmenu(item.id, child)}
                                                            title="Chỉnh sửa"
                                                        >
                                                            <Edit size={14} className="text-muted-foreground hover:text-foreground" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            className="h-8 w-8 p-0 rounded-lg bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors"
                                                            onClick={() => handleDeleteSubmenu(item.id, child.id)}
                                                            title="Xóa"
                                                        >
                                                            <Trash2 size={14} className="text-muted-foreground hover:text-foreground" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
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

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tùy chọn</label>
                            <div className="flex items-center gap-2 px-3 h-10 bg-background border rounded-md whitespace-nowrap">
                                <span className="text-sm">External</span>
                                <Switch
                                    checked={newItem.isExternal}
                                    onChange={(checked) => setNewItem({ ...newItem, isExternal: checked })}
                                />
                            </div>
                        </div>

                        <div className="flex items-end">
                            <Button onClick={handleAddItem} className="gap-2 h-10">
                                <Plus size={16} /> Thêm
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Submenu Add Modal */}
            {submenuModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSubmenuModal({ ...submenuModal, open: false })} />
                    <div className="relative bg-background border rounded-lg shadow-xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Thêm Submenu</h3>
                            <button onClick={() => setSubmenuModal({ ...submenuModal, open: false })} className="p-1 hover:bg-muted rounded-full">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tên hiển thị</label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={submenuModal.label}
                                    onChange={e => setSubmenuModal({ ...submenuModal, label: e.target.value })}
                                    placeholder="VD: Data Science"
                                    autoFocus
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Đường dẫn</label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={submenuModal.href}
                                    onChange={e => setSubmenuModal({ ...submenuModal, href: e.target.value })}
                                    placeholder="VD: /courses/data-science"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="ghost" onClick={() => setSubmenuModal({ ...submenuModal, open: false })}>
                                Hủy
                            </Button>
                            <Button onClick={handleAddSubmenu}>
                                Thêm
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
