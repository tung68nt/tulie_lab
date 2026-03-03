export default function RootLoading() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/50 backdrop-blur-sm pointer-events-none">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-sm"></div>
        </div>
    );
}
