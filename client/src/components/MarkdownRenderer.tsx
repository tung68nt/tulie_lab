'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn, slugify } from '@/lib/utils';
import { Check, Copy, Info, AlertTriangle, Lightbulb } from 'lucide-react';
import { useState } from 'react';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { ghcolors } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

const extractText = (children: any): string => {
    if (typeof children === 'string' || typeof children === 'number') return children.toString();
    if (Array.isArray(children)) return children.map(extractText).join('');
    if (React.isValidElement(children)) return extractText((children.props as any).children);
    return '';
};

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
    return (
        <div className={cn("prose prose-zinc dark:prose-invert max-w-none prose-lg prose-p:leading-relaxed prose-headings:tracking-tight", className)}>
            <style jsx global>{`
                .prose table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 1.5rem 0;
                    font-size: 14px;
                }
                .prose thead {
                    background-color: #f6f8fa;
                    border-bottom: 1px solid #e1e4e8;
                }
                .prose th {
                    text-align: left;
                    padding: 8px 12px;
                    font-weight: 600;
                    color: #24292e;
                    border: 1px solid #dfe2e5;
                }
                .prose td {
                    padding: 8px 12px;
                    border: 1px solid #dfe2e5;
                    color: #24292e;
                }
                .dark .prose thead { background-color: #161b22; border-bottom-color: #30363d; }
                .dark .prose th { color: #c9d1d9; border-color: #30363d; }
                .dark .prose td { color: #c9d1d9; border-color: #30363d; }

                .prose pre, .prose pre code {
                    background-color: transparent !important;
                    background: transparent !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    box-shadow: none !important;
                }
                /* Target BOTH react-syntax-highlighter line numbers and Prism content */
                .react-syntax-highlighter-line-number, 
                code[class*="language-"] span,
                .prose pre span,
                .prose pre code {
                    font-style: normal !important;
                    text-decoration: none !important;
                    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
                    font-size: 14px !important;
                }
                code[class*="language-"], pre[class*="language-"] {
                    background: transparent !important;
                    box-shadow: none !important;
                }
                /* Syntax Highlighting - Exact Match to cli.knowns.dev (GitHub-inspired palette) */
                /* Syntax Highlighting - Force Colors */
                .token.comment { color: #6A737D !important; }
                .token.punctuation { color: #24292e !important; }
                .token.property, .token.tag, .token.boolean, .token.number, .token.constant, .token.symbol, .token.deleted { color: #005CC5 !important; }
                .token.selector, .token.attr-name, .token.string, .token.char, .token.builtin, .token.inserted { color: #032F62 !important; }
                .token.operator, .token.entity, .token.url { color: #005CC5 !important; }
                .token.atrule, .token.attr-value, .token.keyword { color: #D73A49 !important; }
                .token.function, .token.class-name { color: #6F42C1 !important; }
                .token.parameter, .token.variable { color: #005CC5 !important; }
                /* For Shell/Bash specifically */
                .language-bash .token.function, .language-shell .token.function { color: #6F42C1 !important; }
                .language-bash .token.parameter, .language-shell .token.parameter { color: #005CC5 !important; }
                
                /* Dark Mode Overrides */
                .dark .token.comment { color: #8b949e !important; }
                .dark .token.punctuation { color: #c9d1d9 !important; }
                .dark .token.property, .dark .token.tag, .dark .token.boolean, .dark .token.number, .dark .token.constant, .dark .token.symbol { color: #79B8FF !important; }
                .dark .token.selector, .dark .token.attr-name, .dark .token.string, .dark .token.char, .dark .token.builtin { color: #A5D6FF !important; }
                .dark .token.keyword, .dark .token.atrule, .dark .token.attr-value { color: #FF7B72 !important; }
                .dark .token.function, .dark .token.class-name { color: #B392F0 !important; }
                .dark .token.parameter, .dark .token.variable { color: #79B8FF !important; }
            `}</style>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Custom heading tags to support TOC anchors
                    h1: ({ node, ...props }) => <h1 id={slugify(extractText(props.children))} {...props} className="scroll-m-20 text-4xl font-bold tracking-tight mb-8 first:mt-0" />,
                    h2: ({ node, ...props }) => <h2 id={slugify(extractText(props.children))} {...props} className="scroll-m-20 border-b pb-2 text-3xl font-bold tracking-tight mt-12 mb-4 first:mt-0" />,
                    h3: ({ node, ...props }) => <h3 id={slugify(extractText(props.children))} {...props} className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-4 first:mt-0" />,
                    p: ({ node, ...props }) => <p {...props} className="leading-7 [&:not(:first-child)]:mt-6" />,
                    hr: () => <hr className="hidden" />,

                    // Custom Code Block with Copy Button
                    code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        const [copied, setCopied] = useState(false);

                        const handleCopy = () => {
                            navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        };

                        if (!inline) {
                            return (
                                <div className="relative group my-4">
                                    <div className="absolute right-4 top-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={handleCopy}
                                            className="p-1.5 rounded-md bg-white/80 backdrop-blur-sm border border-zinc-200 text-zinc-500 hover:text-primary transition-colors shadow-none"
                                            title="Copy code"
                                            style={{ boxShadow: 'none' }}
                                        >
                                            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                        </button>
                                    </div>
                                    <div className="rounded-xl border border-zinc-200/50 bg-white overflow-hidden" style={{ boxShadow: 'none' }}>
                                        <SyntaxHighlighter
                                            {...props}
                                            style={ghcolors}
                                            language={match ? match[1] : 'markdown'}
                                            PreTag="div"
                                            showLineNumbers={true}
                                            lineNumberStyle={{
                                                minWidth: '3.5em',
                                                paddingRight: '1.25em',
                                                color: '#a1a1aa',
                                                textAlign: 'right',
                                                userSelect: 'none',
                                                fontSize: '11px',
                                                fontStyle: 'normal',
                                            }}
                                            customStyle={{
                                                margin: 0,
                                                padding: '1.25rem 1rem',
                                                fontSize: '14px',
                                                lineHeight: '1.6',
                                                backgroundColor: 'transparent',
                                                boxShadow: 'none',
                                            }}
                                            codeTagProps={{
                                                style: {
                                                    backgroundColor: 'transparent',
                                                    fontStyle: 'normal',
                                                    boxShadow: 'none',
                                                }
                                            }}
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <code
                                className={cn(
                                    "px-1.5 py-[1px] rounded-md bg-zinc-100 text-zinc-900 font-medium font-mono text-[13px] border border-zinc-200/50 inline-block align-middle",
                                    className
                                )}
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },

                    // blockquote for Callouts (custom implementation)
                    blockquote: ({ children }) => {
                        const childrenArray = React.Children.toArray(children);

                        // Try to find the first text content to identify the callout type
                        let firstText = '';
                        const findText = (node: any): string => {
                            if (typeof node === 'string') return node;
                            if (node?.props?.children) {
                                if (Array.isArray(node.props.children)) {
                                    return findText(node.props.children[0]);
                                }
                                return findText(node.props.children);
                            }
                            return '';
                        };

                        firstText = findText(childrenArray[0]);

                        let icon = <Info className="w-5 h-5 text-blue-500" />;
                        let borderClass = 'border-blue-500 bg-blue-50 dark:bg-blue-900/10';
                        let title = 'Ghi chú';

                        if (firstText.startsWith('[!NOTE]')) {
                            // Already default
                        } else if (firstText.startsWith('[!WARNING]')) {
                            icon = <AlertTriangle className="w-5 h-5 text-amber-500" />;
                            borderClass = 'border-amber-500 bg-amber-50 dark:bg-amber-900/10';
                            title = 'Cảnh báo';
                        } else if (firstText.startsWith('[!TIP]')) {
                            icon = <Lightbulb className="w-5 h-5 text-emerald-500" />;
                            borderClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10';
                            title = 'Mẹo';
                        } else {
                            // Regular blockquote
                            return (
                                <blockquote className="border-l-4 border-muted pl-4 italic my-4">
                                    {children}
                                </blockquote>
                            );
                        }

                        // Remove the marker from the actual rendered content
                        const cleanChildren = React.Children.map(children, (child: any) => {
                            const processChild = (node: any): any => {
                                if (typeof node === 'string') {
                                    return node.replace(/^\[!.*?\]\s*/, '');
                                }
                                if (node?.props?.children) {
                                    const processed = Array.isArray(node.props.children)
                                        ? [processChild(node.props.children[0]), ...node.props.children.slice(1)]
                                        : processChild(node.props.children);

                                    return React.cloneElement(node, { children: processed });
                                }
                                return node;
                            };
                            return processChild(child);
                        });

                        return (
                            <div className={cn("my-6 border-l-4 p-4 rounded-r-lg", borderClass)}>
                                <div className="flex items-center gap-2 mb-2 font-bold text-sm uppercase tracking-wider">
                                    {icon}
                                    <span>{title}</span>
                                </div>
                                <div className="text-sm leading-relaxed prose-p:my-1">
                                    {cleanChildren}
                                </div>
                            </div>
                        );
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </div >
    );
}
