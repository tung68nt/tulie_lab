import { Loader2 } from 'lucide-react';
export default function RootLoading() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/50 backdrop-blur-sm pointer-events-none">
            <Loader2 className="animate-spin w-8 h-8 text-primary " />
        </div>
    );
}
