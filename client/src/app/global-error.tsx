'use client';

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Global Error:', error);
    }, [error]);

    return (
        <html>
            <body className="bg-black text-white">
                <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
                    <h2 className="text-2xl font-bold mb-4">CRITICAL SYSTEM ERROR</h2>
                    <p className="text-red-400 mb-6">Something went wrong in the Root Layout.</p>

                    <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 p-4 rounded-lg overflow-auto text-left text-xs font-mono mb-6">
                        <p className="font-bold text-red-500 mb-2">{error.name}: {error.message}</p>
                        <pre className="whitespace-pre-wrap opacity-70">
                            {error.stack}
                        </pre>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => reset()}
                            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
                        >
                            Try again
                        </button>
                        <button
                            onClick={() => {
                                localStorage.clear();
                                window.location.reload();
                            }}
                            className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-950/20"
                        >
                            Clear Cache & Reload
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
