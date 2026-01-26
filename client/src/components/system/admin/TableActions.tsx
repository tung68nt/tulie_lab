import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Edit, Trash2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
    onClick?: () => void;
    href?: string;
    title: string;
    icon: React.ElementType;
    variant?: 'ghost' | 'outline' | 'secondary' | 'danger';
}

interface TableActionsProps {
    onEdit?: () => void;
    editUrl?: string;
    onDelete?: () => void;
    onView?: () => void;
    viewUrl?: string;
    customActions?: ActionButtonProps[];
    className?: string;
}

export function TableActions({
    onEdit,
    editUrl,
    onDelete,
    onView,
    viewUrl,
    customActions = [],
    className
}: TableActionsProps) {
    const buttonClass = "h-8 w-8 p-0 rounded-lg bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors";

    return (
        <div className={cn("flex items-center gap-2", className)}>
            {/* View Action */}
            {(onView || viewUrl) && (
                viewUrl ? (
                    <Link href={viewUrl} target="_blank">
                        <Button as="div" variant="outline" size="icon" className={buttonClass} title="Xem chi tiết">
                            <Eye size={16} className="text-muted-foreground hover:text-foreground" />
                        </Button>
                    </Link>
                ) : (
                    <Button variant="outline" size="icon" className={buttonClass} onClick={onView} title="Xem chi tiết">
                        <Eye size={16} className="text-muted-foreground hover:text-foreground" />
                    </Button>
                )
            )}

            {/* Custom Actions */}
            {customActions.map((action, idx) => (
                action.href ? (
                    <Link key={idx} href={action.href}>
                        <Button as="div" variant="outline" size="icon" className={buttonClass} title={action.title}>
                            <action.icon size={16} className="text-muted-foreground hover:text-foreground" />
                        </Button>
                    </Link>
                ) : (
                    <Button key={idx} variant="outline" size="icon" className={buttonClass} onClick={action.onClick} title={action.title}>
                        <action.icon size={16} className="text-muted-foreground hover:text-foreground" />
                    </Button>
                )
            ))}

            {/* Edit Action */}
            {(onEdit || editUrl) && (
                editUrl ? (
                    <Link href={editUrl}>
                        <Button as="div" variant="outline" size="icon" className={buttonClass} title="Chỉnh sửa">
                            <Edit size={16} className="text-muted-foreground hover:text-foreground" />
                        </Button>
                    </Link>
                ) : (
                    <Button variant="outline" size="icon" className={buttonClass} onClick={onEdit} title="Chỉnh sửa">
                        <Edit size={16} className="text-muted-foreground hover:text-foreground" />
                    </Button>
                )
            )}

            {/* Delete Action */}
            {onDelete && (
                <Button
                    variant="outline"
                    size="icon"
                    className={buttonClass}
                    onClick={onDelete}
                    title="Xóa"
                >
                    <Trash2 size={16} className="text-muted-foreground transition-colors" />
                </Button>
            )}
        </div>
    );
}
