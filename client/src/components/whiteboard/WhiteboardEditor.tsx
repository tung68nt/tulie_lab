/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useRouter } from 'next/navigation';
import { exportToBlob } from '@excalidraw/excalidraw';

import ExcalidrawWrapper from './ExcalidrawWrapper';
import { api } from '@/lib/api';
// import SaveStatusIndicator, { SaveStatus } from './SaveStatusIndicator'; // Kept for type import if needed
import { SaveStatus } from './SaveStatusIndicator';
import WhiteboardHeader from './WhiteboardHeader';
import WelcomeScreen from './WelcomeScreen';

interface WhiteboardEditorProps {
    id: string;
}

export default function WhiteboardEditor({ id }: WhiteboardEditorProps) {
    const router = useRouter();
    const [whiteboard, setWhiteboard] = useState<any>(null);
    const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Optimized UI State
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
    const [showWelcome, setShowWelcome] = useState(false);
    const [parsedInitialData, setParsedInitialData] = useState<{ elements?: any[]; appState?: any } | undefined>(undefined);

    // Refs for performance (avoid state updates during drawing)
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastEmitTimeRef = useRef<number>(0);
    const lastPointerUpdateRef = useRef<number>(0);
    const socketRef = useRef<any>(null);
    const creatingRef = useRef(false);
    const whiteboardRef = useRef<any>(null);
    const currentElementsRef = useRef<readonly any[]>([]);

    // Keep ref in sync
    useEffect(() => {
        whiteboardRef.current = whiteboard;
    }, [whiteboard]);

    // Initial Load Data
    useEffect(() => {
        console.log('WhiteboardEditor mounted with ID:', id);

        const loadWhiteboard = async () => {
            if (id === 'new') {
                if (creatingRef.current) return;
                creatingRef.current = true;

                console.log('Attempting to create new whiteboard...');
                try {
                    const newWhiteboard = await api.whiteboards.create({ title: 'Untitled Whiteboard' });
                    setWhiteboard(newWhiteboard);
                    router.replace(`/whiteboard/${newWhiteboard.id}`);
                    return;
                } catch (error) {
                    console.error('Failed to create new whiteboard:', error);
                    creatingRef.current = false;
                }
            } else {
                console.log('Loading existing whiteboard:', id);
            }

            try {
                const data = await api.whiteboards.get(id);
                setWhiteboard(data);

                // Parse initial data for Excalidraw
                const rawElements = data.artboards?.[0]?.elements;
                console.log('=== PARSING INITIAL DATA ===');
                console.log('Raw elements:', rawElements);

                if (rawElements) {
                    try {
                        const parsed = typeof rawElements === 'string'
                            ? JSON.parse(rawElements)
                            : rawElements;

                        console.log('Parsed data:', parsed);

                        let elements: any[] = [];
                        let appState = {};

                        if (Array.isArray(parsed)) {
                            // Legacy format: just array of elements
                            elements = parsed;
                        } else if (parsed && parsed.elements) {
                            // Correct format: { elements, appState }
                            elements = parsed.elements;
                            appState = parsed.appState || {};
                        }

                        console.log('Final elements count:', elements.length);

                        if (elements.length > 0) {
                            setParsedInitialData({ elements, appState });
                            currentElementsRef.current = elements;
                        } else {
                            setShowWelcome(true);
                        }
                    } catch (e) {
                        console.error('Failed to parse elements:', e);
                        setShowWelcome(true);
                    }
                } else {
                    setShowWelcome(true);
                }
            } catch (error) {
                console.error('Failed to load whiteboard:', error);
            } finally {
                setIsLoaded(true);
            }
        };

        if (id) {
            loadWhiteboard();
        }
    }, [id, router]);

    // Socket Connection
    useEffect(() => {
        if (!id || id === 'new') return;

        // Initialize socket
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin, {
            query: { whiteboardId: id },
            transports: ['websocket'],
            reconnection: true,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        socket.on('draw_synced', (data: any) => {
            if (excalidrawAPI && data.elements) {
                // Update scene from remote
                // Check if we have active changes to avoid conflict? Use versioning ideally.
                // For now, straightforward update
                excalidrawAPI.updateScene({
                    elements: data.elements,
                    commitToHistory: false
                });
            }
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [id, excalidrawAPI]);

    // Handle initial data for Excalidraw
    useEffect(() => {
        if (!excalidrawAPI || !whiteboard?.artboards?.[0]) return;

        const rawElements = whiteboard.artboards[0].elements;
        console.log('=== DEBUG: Data Loading ===');
        console.log('1. Raw elements from API:', rawElements);
        console.log('2. Type of rawElements:', typeof rawElements);

        if (!rawElements) {
            console.log('3. No elements found, skipping load');
            return;
        }

        console.log('Loading data into Excalidraw', whiteboard.title);

        try {
            const elementsData = typeof rawElements === 'string'
                ? JSON.parse(rawElements)
                : rawElements;

            console.log('4. Parsed elementsData:', elementsData);
            console.log('5. elementsData type:', typeof elementsData);
            console.log('6. Is array?:', Array.isArray(elementsData));

            let finalElements: any[] = [];
            let finalAppState = {};

            if (Array.isArray(elementsData)) {
                // Recovery: Handle data saved during bug period (just array of elements)
                console.warn('7. Recovering legacy array data format');
                finalElements = elementsData;
            } else if (elementsData && elementsData.elements) {
                // Correct format: { elements: [...], appState: {...} }
                console.log('7. Using correct format with elements key');
                finalElements = elementsData.elements;
                finalAppState = elementsData.appState || {};
            } else if (elementsData && typeof elementsData === 'object') {
                // Maybe double-stringified?
                console.warn('7. Unknown format, trying to extract elements:', Object.keys(elementsData));
            }

            console.log('8. Final elements count:', finalElements?.length);
            console.log('9. Sample element:', finalElements?.[0]);

            if (finalElements && finalElements.length > 0) {
                console.log('10. Calling updateScene with', finalElements.length, 'elements');
                excalidrawAPI.updateScene({
                    elements: finalElements,
                    appState: finalAppState
                });
                currentElementsRef.current = finalElements;
                console.log('11. updateScene called successfully');
            } else {
                console.warn('10. No elements to load');
            }
        } catch (e) {
            console.error('Failed to parse whiteboard elements:', e);
            console.error('Raw data was:', rawElements);
        }

    }, [excalidrawAPI, whiteboard]);

    // Style HintViewer text with kbd tags + Translate UI to Vietnamese
    useEffect(() => {
        // Translation map for bilingual display
        const translations: Record<string, string> = {
            // Help dialog title
            'Help': 'Trợ giúp',
            'Keyboard shortcuts': 'Phím tắt',
            'Tools': 'Công cụ',
            'Editor': 'Trình chỉnh sửa',
            // Tool names
            'Hand (panning tool)': 'Công cụ di chuyển',
            'Selection': 'Chọn đối tượng',
            'Rectangle': 'Hình chữ nhật',
            'Diamond': 'Hình thoi',
            'Ellipse': 'Hình elip',
            'Arrow': 'Mũi tên',
            'Line': 'Đường thẳng',
            'Draw': 'Vẽ tự do',
            'Text': 'Văn bản',
            'Insert image': 'Chèn ảnh',
            'Eraser': 'Tẩy',
            'Frame tool': 'Khung',
            'Laser pointer': 'Con trỏ laser',
            'Pick color from canvas': 'Chọn màu từ canvas',
            // Editor actions
            'Create a flowchart from a generic element': 'Tạo lưu đồ',
            'Navigate a flowchart': 'Di chuyển lưu đồ',
            'Move canvas': 'Di chuyển canvas',
            'Reset the canvas': 'Đặt lại canvas',
            'Delete': 'Xóa',
            'Cut': 'Cắt',
            'Copy': 'Sao chép',
            'Paste': 'Dán',
            'Paste as plaintext': 'Dán văn bản thuần',
            'Select all': 'Chọn tất cả',
            'Add element to selection': 'Thêm vào vùng chọn',
            'Deep select': 'Chọn sâu',
            'Deep select within box, and prevent dragging': 'Chọn sâu trong hộp',
            'Copy to clipboard as PNG': 'Sao chép PNG',
            // Menu items  
            'Save to...': 'Lưu vào...',
            'Export image...': 'Xuất ảnh...',
            'Find on canvas': 'Tìm trên canvas',
            'Canvas background': 'Màu nền canvas',
        };

        const translateElement = (el: Element) => {
            const text = el.textContent?.trim();
            if (text && translations[text]) {
                el.textContent = translations[text];
            }
        };

        const styleHintViewer = () => {
            const hintViewer = document.querySelector('.HintViewer span');
            if (!hintViewer || hintViewer.querySelector('kbd')) return;

            const text = hintViewer.textContent || '';
            // Regex to match keys: Modifiers, named keys, or single uppercase letters (A-Z) and numbers (0-9)
            // Avoid matching common words unless they are specifically capitalised key names like 'Space'
            const keyRegex = /\b(Scroll wheel|Space|Option|Cmd|Ctrl|Alt|Shift|Enter|Delete|Backspace|Esc|Tab|Return|PgUp|PgDn|End|Home|Ins|Del|Arrow [A-Za-z]+|[A-Z0-9])\b/g;

            let styledText = text
                .replace(/mouse wheel/gi, 'Scroll wheel')
                .replace(/spacebar/gi, 'Space')
                .replace(/To move canvas, hold/gi, 'Di chuyển canvas:');

            styledText = styledText.replace(keyRegex, (match) => `<kbd class="excalidraw-kbd">${match}</kbd>`);

            if (styledText !== text) {
                hintViewer.innerHTML = styledText;
            }
        };

        const translateUI = () => {
            // Translate Help dialog title
            const helpTitle = document.querySelector('.HelpDialog h3');
            if (helpTitle) translateElement(helpTitle);

            // Translate section titles in Help dialog
            document.querySelectorAll('.HelpDialog h4').forEach(translateElement);

            // Translate table cells in Help dialog (tool/action names)
            document.querySelectorAll('.HelpDialog td:first-child').forEach(translateElement);

            // Translate menu items (correct selector: .dropdown-menu-item__text)
            document.querySelectorAll('.dropdown-menu-item__text').forEach(translateElement);

            // Translate menu group titles
            document.querySelectorAll('.dropdown-menu-group-title').forEach(translateElement);
        };

        // Observer to watch for HintViewer and dialog changes
        const observer = new MutationObserver(() => {
            styleHintViewer();
            translateUI();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Initial run
        styleHintViewer();
        translateUI();

        return () => observer.disconnect();
    }, []);

    // --- OPTIMIZED HANDLERS ---

    const handleStartDrawing = useCallback(() => {
        setShowWelcome(false);
    }, []);

    const onChange = useCallback((elements: readonly any[], appState: any) => {
        // Fast path: Update ref immediately
        currentElementsRef.current = elements;

        // Debounce Network Operations (Save & Sync)
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Hide welcome screen if elements exist
        // check ref to avoid dependency
        if (elements.length > 0) {
            setShowWelcome((prev) => {
                if (prev) return false;
                return prev;
            });
        }

        saveTimeoutRef.current = setTimeout(async () => {
            // THROTTLED SOCKET EMISSION: 500ms
            const now = Date.now();
            if (now - lastEmitTimeRef.current > 500) {
                lastEmitTimeRef.current = now;
                if (socketRef.current?.connected) {
                    socketRef.current.emit('draw_change', {
                        whiteboardId: id,
                        changes: {
                            elements: elements,
                            appState: {
                                viewBackgroundColor: appState.viewBackgroundColor
                            }
                        }
                    });
                }
            }

            // AUTO-SAVE to API
            const currentWhiteboard = whiteboardRef.current;
            if (currentWhiteboard?.artboards?.[0]?.id) {
                // Guard: Don't save if empty (prevents overwriting with blank state on load)
                if (!elements || elements.length === 0) {
                    console.log('Skipping auto-save: No elements to save');
                    return;
                }

                // Check if we have only deleted elements (optional, depends on behavior)
                const hasNonDeleted = elements.some((el: any) => !el.isDeleted);
                if (!hasNonDeleted && elements.length > 0) {
                    // We allow saving "all deleted" if the user actually deleted everything.
                    // But strictly speaking, on initial load, it might be empty.
                }

                setSaveStatus('saving');

                const snapshot = {
                    elements: elements,
                    appState: {
                        viewBackgroundColor: appState.viewBackgroundColor,
                        currentItemFontFamily: appState.currentItemFontFamily,
                        currentItemFontSize: appState.currentItemFontSize,
                        // Add other necessary appState props
                    }
                };

                try {
                    // Generate Thumbnail
                    const blob = await exportToBlob({
                        elements,
                        mimeType: 'image/jpeg',
                        appState: {
                            ...appState,
                            viewBackgroundColor: appState.viewBackgroundColor || '#ffffff',
                        },
                        files: excalidrawAPI.getFiles(),
                        quality: 0.5, // Low quality for thumbnail
                    });

                    // Convert blob to base64
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = async () => {
                        const base64data = reader.result;
                        await api.whiteboards.update(currentWhiteboard.id, { thumbnail: base64data as string });
                    }

                    await api.whiteboards.saveArtboard(currentWhiteboard.artboards[0].id, snapshot);
                    setSaveStatus('saved');
                } catch (err: any) {
                    console.error('Auto-save failed:', err);
                    setSaveStatus('error');
                }
            }

        }, 500); // Increased debounce to 500ms for better perf
    }, [id, excalidrawAPI]); // REMOVED whiteboard, showWelcome dependence

    // Throttle: 200ms (Reduced frequency)
    const onPointerUpdate = useCallback((activeTool: any, pointerData: any) => {
        const now = Date.now();
        if (now - lastPointerUpdateRef.current > 200) {
            lastPointerUpdateRef.current = now;
            if (socketRef.current?.connected) {
                socketRef.current.emit('cursor_move', {
                    whiteboardId: id,
                    point: { x: pointerData.x, y: pointerData.y },
                    userName: 'User'
                });
            }
        }
    }, [id]);

    const handleRename = async (newTitle: string) => {
        if (!whiteboard || !newTitle.trim()) return;

        // Optimistic update
        setWhiteboard((prev: any) => ({ ...prev, title: newTitle }));

        try {
            await api.whiteboards.update(id, { title: newTitle });
        } catch (error) {
            console.error('Failed to rename whiteboard:', error);
            // Revert on error (optional, or just show toast)
        }
    };

    if (!isLoaded && id !== 'new') {
        return (
            <div className="flex items-center justify-center w-full h-screen bg-background">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <WhiteboardHeader
                title={whiteboard?.title}
                saveStatus={saveStatus}
                onBack={() => router.push('/whiteboard')}
                onRename={handleRename}
            />

            <ExcalidrawWrapper
                excalidrawAPI={setExcalidrawAPI}
                onChange={onChange}
                onPointerUpdate={onPointerUpdate}
                onBack={() => router.back()}
                title={whiteboard?.title}
                initialData={parsedInitialData}
            />

            {/* SaveStatusIndicator removed in favor of Header */}

            {showWelcome && (
                <WelcomeScreen onStart={handleStartDrawing} />
            )}
        </div>
    );
}
