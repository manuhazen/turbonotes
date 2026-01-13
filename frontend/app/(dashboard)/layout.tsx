export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-stone-50">
            <aside className="w-64 bg-white border-r border-stone-200">
                Sidebar Placeholder
            </aside>
            <main className="flex-1 p-8">
                <header className="mb-8">Navbar Placeholder</header>
                {children}
            </main>
        </div>
    );
}
