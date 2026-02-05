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
                    padding: 2rem 3rem !important; /* Match container padding */
                    font-family: var(--font-sans) !important;
                    max-width: 65ch; /* Match prose width approximately if needed, or keeping it fluid but padded */
                    margin: 0 auto;
                }
                
                /* Headings - matching MarkdownRenderer prose-premium */
                .bn-block[data-type="heading"][data-level="1"] .bn-inline-content {
                    font-size: 2.25rem !important; /* text-4xl */
                    line-height: 2.5rem !important;
                    font-weight: 700 !important;
                    letter-spacing: -0.025em !important; /* tracking-tight */
                    margin-bottom: 2rem !important;
                    padding-top: 0.25rem !important;
                }
                .bn-block[data-type="heading"][data-level="2"] .bn-inline-content {
                    font-size: 1.875rem !important; /* text-3xl */
                    line-height: 2.25rem !important;
                    font-weight: 700 !important;
                    letter-spacing: -0.025em !important;
                    margin-top: 3rem !important;
                    margin-bottom: 1rem !important;
                    padding-bottom: 0.5rem !important;
                    border-bottom: 1px solid #e4e4e7 !important; /* border-zinc-200 */
                }
                .bn-block[data-type="heading"][data-level="3"] .bn-inline-content {
                    font-size: 1.5rem !important; /* text-2xl */
                    line-height: 2rem !important;
                    font-weight: 600 !important;
                    letter-spacing: -0.025em !important;
                    margin-top: 2rem !important;
                    margin-bottom: 1rem !important;
                }

                /* Paragraphs */
                .bn-block[data-type="paragraph"] .bn-inline-content {
                    line-height: 1.75 !important; /* leading-7 */
                    margin-bottom: 1.5rem !important;
                }

                /* Table styling - Exactly matching MarkdownRenderer */
                .bn-block[data-type="table"] table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 2.5rem 0 !important;
                    font-size: 14px;
                }
                .bn-block[data-type="table"] th {
                    background-color: #f9fafb !important;
                    text-align: left;
                    padding: 12px 16px !important;
                    font-weight: 600 !important;
                    color: #111 !important;
                    border: 1px solid #eaeaea !important;
                }
                .bn-block[data-type="table"] td {
                    padding: 12px 16px !important;
                    border: 1px solid #eaeaea !important;
                    color: #444 !important;
                }
                .dark .bn-block[data-type="table"] th { background-color: #111 !important; border-color: #333 !important; color: #fafafa !important; }
                .dark .bn-block[data-type="table"] td { border-color: #333 !important; color: #888 !important; }

                /* Code Block - Container */
                .bn-block[data-type="codeBlock"] {
                    margin: 2rem 0 !important;
                }
                .bn-block[data-type="codeBlock"] .bn-code-content-wrapper {
                   background-color: white !important;
                   border: 1px solid #e4e4e7 !important;
                   border-radius: 0.5rem !important; /* rounded-lg */
                   box-shadow: none !important;
                   padding: 1.5rem 1rem !important;
                }
                .dark .bn-block[data-type="codeBlock"] .bn-code-content-wrapper {
                    background-color: transparent !important; /* or slightly darker */
                    border-color: #333 !important;
                }

                /* Syntax Highlighting - High Vibrancy Overrides (Vercel Look) */
                .bn-block[data-type="codeBlock"] .token.comment { color: #8e8e8e !important; }
                .bn-block[data-type="codeBlock"] .token.punctuation { color: #999 !important; }
                
                .bn-block[data-type="codeBlock"] .token.atrule, 
                .bn-block[data-type="codeBlock"] .token.attr-name, 
                .bn-block[data-type="codeBlock"] .token.keyword, 
                .bn-block[data-type="codeBlock"] .token.tag, 
                .bn-block[data-type="codeBlock"] .token.selector { 
                    color: #d73a49 !important; 
                    font-weight: 500 !important; 
                }
                
                .bn-block[data-type="codeBlock"] .token.string, 
                .bn-block[data-type="codeBlock"] .token.char, 
                .bn-block[data-type="codeBlock"] .token.attr-value, 
                .bn-block[data-type="codeBlock"] .token.boolean, 
                .bn-block[data-type="codeBlock"] .token.inserted { 
                    color: #005cc5 !important; 
                }
                
                .bn-block[data-type="codeBlock"] .token.function, 
                .bn-block[data-type="codeBlock"] .token.class-name, 
                .bn-block[data-type="codeBlock"] .token.builtin, 
                .bn-block[data-type="codeBlock"] .token.property { 
                    color: #6f42c1 !important; 
                }
                
                .bn-block[data-type="codeBlock"] .token.constant, 
                .bn-block[data-type="codeBlock"] .token.number, 
                .bn-block[data-type="codeBlock"] .token.symbol, 
                .bn-block[data-type="codeBlock"] .token.deleted, 
                .bn-block[data-type="codeBlock"] .token.variable { 
                    color: #032f62 !important; 
                }
                .bn-block[data-type="codeBlock"] .token.operator, 
                .bn-block[data-type="codeBlock"] .token.entity, 
                .bn-block[data-type="codeBlock"] .token.url { 
                    color: #005cc5 !important; 
                }

                /* Dark Mode Syntax */
                .dark .bn-block[data-type="codeBlock"] .token.comment { color: #888 !important; }
                .dark .bn-block[data-type="codeBlock"] .token.punctuation { color: #666 !important; }
                .dark .bn-block[data-type="codeBlock"] .token.keyword, 
                .dark .bn-block[data-type="codeBlock"] .token.tag { color: #ff4d4d !important; }
                .dark .bn-block[data-type="codeBlock"] .token.string { color: #50e3c2 !important; }
                .dark .bn-block[data-type="codeBlock"] .token.function { color: #f81ce5 !important; }
                .dark .bn-block[data-type="codeBlock"] .token.number, 
                .dark .bn-block[data-type="codeBlock"] .token.constant { color: #3291ff !important; }

                /* Code Block - Content & Font */
                .bn-block[data-type="codeBlock"] .bn-inline-content,
                .bn-block[data-type="codeBlock"] pre,
                .bn-block[data-type="codeBlock"] code {
                    background-color: transparent !important;
                    color: #24292e !important;
                    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
                    font-size: 14px !important;
                    line-height: 1.6 !important;
                }
                
                /* Inline code styling */
                .bn-inline-content code {
                    background-color: #f4f4f5 !important; /* bg-zinc-100 */
                    color: #18181b !important; /* text-zinc-900 */
                    padding: 2px 6px !important;
                    border-radius: 6px !important;
                    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
                    font-size: 13px !important;
                    font-weight: 500 !important;
                    border: 1px solid rgba(228, 228, 231, 0.5) !important; /* border-zinc-200/50 */
                }

                /* Blockquote */
                .bn-block[data-type="blockquote"] {
                    border-left: 4px solid #e4e4e7 !important;
                    padding-left: 1rem !important;
                    font-style: italic !important;
                    margin: 1.5rem 0 !important;
                }

                /* Lists */
                .bn-block[data-type="bulletListItem"] .bn-inline-content,
                .bn-block[data-type="numberedListItem"] .bn-inline-content {
                    line-height: 1.75 !important;
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
