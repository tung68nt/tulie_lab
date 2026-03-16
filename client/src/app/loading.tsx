export default function RootLoading() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/50 backdrop-blur-sm pointer-events-none">
            <div
                className="w-8 h-8 rounded-full border-3 border-border border-t-primary animate-spin"
                style={{ animationDuration: '0.6s' }}
            />
        </div>
    );
}
