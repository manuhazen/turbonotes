export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#FDF8EE] p-4">
            {children}
        </div>
    );
}
