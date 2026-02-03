'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { Check, Copy, Info, AlertTriangle, Lightbulb } from 'lucide-react';
import { useState } from 'react';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
    return (
        <div className={cn("prose prose-zinc dark:prose-invert max-w-none", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Custom heading tags to support TOC anchors
                    h1: ({ node, ...props }) => <h1 id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')} {...props} className="scroll-m-20 text-3xl md:text-4xl font-semibold tracking-tight my-6" />,
                    h2: ({ node, ...props }) => <h2 id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')} {...props} className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight my-4" />,
                    h3: ({ node, ...props }) => <h3 id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')} {...props} className="scroll-m-20 text-xl font-semibold tracking-tight my-3" />,

                    // Custom Code Block with Copy Button
                    code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        const [copied, setCopied] = useState(false);

                        const handleCopy = () => {
                            navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        };

                        if (!inline && match) {
                            return (
                                <div className="relative group my-4">
                                    <div className="absolute right-3 top-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={handleCopy}
                                            className="p-1.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                                            title="Copy code"
                                        >
                                            {copied ? <Check size={14} /> : <Copy size={14} />}
                                        </button>
                                    </div>
                                    <pre className="!mb-0 !mt-0 rounded-xl bg-zinc-950 p-4 overflow-x-auto border border-zinc-800">
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    </pre>
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
