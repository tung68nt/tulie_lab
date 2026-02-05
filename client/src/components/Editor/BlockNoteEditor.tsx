'use client';

import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";
import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const mantineTheme = createTheme({
    /** Put your mantine theme override here */
});

interface EditorProps {
    initialContent?: string;
    onChange: (content: string) => void;
    editable?: boolean;
}

export default function Editor({ initialContent, onChange, editable = true }: EditorProps) {
    const { resolvedTheme } = useTheme();
    const [blocks, setBlocks] = useState<PartialBlock[] | null>(null);

    // Initialize editor
    const editor = useCreateBlockNote({
        initialContent: initialContent ? undefined : undefined, // We'll handle initial content below
    });

    // Handle initial content and conversion from Markdown/HTML if needed
    // For simplicity now, we assume initialContent is a JSON string of blocks
    // or we can use editor.tryParseMarkdownToBlocks/editor.tryParseHTMLToBlocks
    useEffect(() => {
        async function loadInitialContent() {
            if (initialContent && editor) {
                try {
                    // Try to parse as JSON first (BlockNote native)
                    const parsed = JSON.parse(initialContent);
                    editor.replaceBlocks(editor.topLevelBlocks, parsed);
                } catch (e) {
                    // If not JSON, try to parse as Markdown
                    const blocks = await editor.tryParseMarkdownToBlocks(initialContent);
                    editor.replaceBlocks(editor.topLevelBlocks, blocks);
                }
            }
        }
        loadInitialContent();
    }, [editor]); // Only run once on mount (or when editor is ready)

    return (
        <MantineProvider theme={mantineTheme} forceColorScheme={resolvedTheme === "dark" ? "dark" : "light"}>
            <style dangerouslySetInnerHTML={{
                __html: `
                .bn-editor {
                    padding-top: 1.5rem !important;
                }
                .bn-block[data-type="heading"][data-level="1"] .bn-inline-content {
                    font-size: 1.875rem !important;
                    font-weight: 600 !important;
                    line-height: 1.3 !important;
                }
                .bn-block[data-type="heading"][data-level="2"] .bn-inline-content {
                    font-size: 1.5rem !important;
                    font-weight: 600 !important;
                }
                .bn-block[data-type="heading"][data-level="3"] .bn-inline-content {
                    font-size: 1.25rem !important;
                    font-weight: 600 !important;
                }
                /* Table styling in editor */
                .bn-block[data-type="table"] table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 0.5rem 0;
                    font-size: 14px;
                }
                .bn-block[data-type="table"] th {
                    background-color: #f6f8fa !important;
                    text-align: left;
                    padding: 8px 12px !important;
                    font-weight: 600 !important;
                    color: #24292e !important;
                    border: 1px solid #dfe2e5 !important;
                }
                .bn-block[data-type="table"] td {
                    padding: 8px 12px !important;
                    border: 1px solid #dfe2e5 !important;
                    color: #24292e !important;
                }
                .dark .bn-block[data-type="table"] th { background-color: #161b22 !important; border-color: #30363d !important; color: #c9d1d9 !important; }
                .dark .bn-block[data-type="table"] td { border-color: #30363d !important; color: #c9d1d9 !important; }

                /* Fix code block background and font */
                .bn-block[data-type="codeBlock"] .bn-inline-content,
                .bn-block[data-type="codeBlock"] pre,
                .bn-block[data-type="codeBlock"] code {
                    background-color: white !important;
                    color: #27272a !important;
                    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
                    font-size: 14px !important;
                }
                .bn-block[data-type="codeBlock"] .bn-code-content-wrapper {
                   background-color: white !important;
                   border: 0.5px solid rgba(0,0,0,0.1) !important;
                   border-radius: 0.75rem !important;
                   box-shadow: none !important;
                   padding: 1.25rem 1rem !important;
                }
                /* Inline code styling */
                .bn-inline-content code {
                    background-color: #f4f4f5 !important; /* bg-zinc-100 */
                    color: #18181b !important; /* text-zinc-900 */
                    padding: 1px 5px !important;
                    border-radius: 6px !important;
                    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
                    font-size: 0.95em !important;
                    font-weight: 500 !important;
                    border: 0.5px solid #e4e4e7 !important; /* border-zinc-200/50 */
                    display: inline-block;
                    vertical-align: middle;
                }
            `}} />
            <div className="border rounded-md min-h-[500px] bg-background p-4">
                <BlockNoteView
                    editor={editor}
                    theme={resolvedTheme === "dark" ? "dark" : "light"}
                    editable={editable}
                    onChange={async () => {
                        // Save as Markdown for compatibility with existing schema
                        const markdown = await editor.blocksToMarkdownLossy(editor.topLevelBlocks);
                        onChange(markdown);
                    }}
                />
            </div>
        </MantineProvider>
    );
}
