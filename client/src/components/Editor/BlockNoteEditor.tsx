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
                    padding-top: 2rem !important;
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
            `}} />
            <div className="border rounded-md min-h-[500px] bg-background">
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
