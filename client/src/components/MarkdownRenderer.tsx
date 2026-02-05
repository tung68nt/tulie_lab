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
                .prose pre, .prose pre code {
                    background-color: transparent !important;
                    background: transparent !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                /* Target BOTH react-syntax-highlighter line numbers and Prism content */
                .react-syntax-highlighter-line-number, 
                code[class*="language-"] span,
                .prose pre span {
                    font-style: normal !important;
                    text-decoration: none !important;
                }
                code[class*="language-"], pre[class*="language-"] {
                    background: transparent !important;
                }
                /* Ensure tokens still have colors */
                .token.comment, .token.prolog, .token.doctype, .token.cdata { color: #708090; }
                .token.punctuation { color: #999; }
            `}</style>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Custom heading tags to support TOC anchors
                    h1: ({ node, ...props }) => <h1 id={slugify(extractText(props.children))} {...props} className="scroll-m-20 text-4xl font-bold tracking-tight mb-8" />,
                    h2: ({ node, ...props }) => <h2 id={slugify(extractText(props.children))} {...props} className="scroll-m-20 border-b pb-2 text-3xl font-bold tracking-tight mt-12 mb-4" />,
                    h3: ({ node, ...props }) => <h3 id={slugify(extractText(props.children))} {...props} className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-4" />,
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
                                <div className="relative group my-6">
                                    <div className="absolute right-4 top-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={handleCopy}
                                            className="p-1.5 rounded-md bg-white/80 backdrop-blur-sm border border-zinc-200 text-zinc-500 hover:text-primary transition-colors shadow-sm"
                                            title="Copy code"
                                        >
                                            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                        </button>
                                    </div>
                                    <div className="my-4 rounded-xl border-[0.5px] border-zinc-200/60 bg-white overflow-hidden shadow-sm">
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
                                                fontSize: '13px',
                                                lineHeight: '1.6',
                                                backgroundColor: 'transparent',
                                            }}
                                            codeTagProps={{
                                                style: {
                                                    backgroundColor: 'transparent',
                                                    fontStyle: 'normal'
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
                            <code className={cn("bg-muted px-1.5 py-0.5 rounded text-sm font-mono", className)} {...props}>
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
        </div>
    );
}
