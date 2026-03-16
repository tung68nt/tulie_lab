'use client';

import React, { useEffect } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { api } from '@/lib/api';

interface EbookProtectorProps {
    ebookId: string;
}

export const EbookProtector: React.FC<EbookProtectorProps> = ({ ebookId }) => {
    const { addToast } = useToast();

    useEffect(() => {
        const logSecurity = async (action: string, details: string) => {
            try {
                await api.post('/security/log', { action, details, ebookId });
            } catch (e) {
                // Ignore log errors
            }
        };

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            logSecurity('RIGHT_CLICK_EBOOK', 'User attempted to right-click in ebook viewer');
        };

        const handleCopy = (e: ClipboardEvent) => {
            e.preventDefault();
            addToast('Nội dung ebook được bảo vệ bản quyền.', 'warning');
            logSecurity('COPY_PASTE_EBOOK', 'User attempted to copy ebook content');

            // Try to clear clipboard if possible
            if (e.clipboardData) {
                e.clipboardData.clearData();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Block DevTools shortcuts
            // F12
            if (e.key === 'F12') {
                e.preventDefault();
                logSecurity('DEVTOOLS_EBOOK', 'F12 pressed in ebook viewer');
                addToast('Chức năng này bị vô hiệu hóa để bảo vệ bản quyền.', 'warning');
                return;
            }

            // Ctrl+Shift+I (Windows) or Cmd+Opt+I (Mac)
            if ((e.ctrlKey || e.metaKey) && (e.shiftKey || e.altKey) && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
                e.preventDefault();
                logSecurity('DEVTOOLS_EBOOK', 'Inspection shortcut pressed in ebook viewer');
                addToast('Chức năng này bị vô hiệu hóa để bảo vệ bản quyền.', 'warning');
                return;
            }

            // Ctrl+U / Cmd+U (View Source)
            if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
                e.preventDefault();
                logSecurity('DEVTOOLS_EBOOK', 'View Source shortcut pressed');
                return;
            }

            // Block Print shortcut (Ctrl+P / Cmd+P)
            if ((e.ctrlKey || e.metaKey) && (e.key === 'P' || e.key === 'p')) {
                e.preventDefault();
                logSecurity('PRINT_EBOOK', 'Print shortcut pressed');
                addToast('Không cho phép in sách điện tử này.', 'warning');
                return;
            }

            // Block Save As shortcut (Ctrl+S / Cmd+S)
            if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's')) {
                e.preventDefault();
                logSecurity('SAVE_EBOOK', 'Save As shortcut pressed');
                addToast('Không cho phép lưu tệp trực tiếp.', 'warning');
                return;
            }
        };

        // Attach listeners
        window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('copy', handleCopy);
        window.addEventListener('cut', handleCopy);

        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('copy', handleCopy);
            window.removeEventListener('cut', handleCopy);
        };
    }, [addToast, ebookId]);

    return (
        <style dangerouslySetInnerHTML={{
            __html: `
                /* Disable text selection and dragging */
                body {
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                    -webkit-user-drag: none;
                }
                
                /* Hide everything when printing */
                @media print {
                    body * {
                        display: none !important;
                    }
                    body::after {
                        content: 'Ebook này được bảo vệ bản quyền bởi Tulie Academy. Việc in ấn không được phép.';
                        display: block !important;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        font-family: sans-serif;
                        font-size: 24px;
                        text-align: center;
                    }
                }
            `
        }} />
    );
};
