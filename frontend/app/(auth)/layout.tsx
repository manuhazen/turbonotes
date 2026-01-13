export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen items-center justify-center bg-stone-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                {children}
            </div>
        </div>
    );
}
