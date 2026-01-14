"use client"

import * as React from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useCategories } from "@/hooks/use-notes"
import { CreateCategoryDialog } from "@/components/create-category-dialog"
import { UserNav } from "@/components/user-nav"
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function SidebarContent({ className, onItemClick }: { className?: string, onItemClick?: () => void }) {
    const { data: categories, isLoading } = useCategories()
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const currentCategoryId = searchParams.get("category")

    const toggleCategory = (categoryId: string) => {
        const params = new URLSearchParams(searchParams)
        if (currentCategoryId === categoryId) {
            params.delete("category")
        } else {
            params.set("category", categoryId)
        }
        router.replace(`${pathname}?${params.toString()}`)
        if (onItemClick) onItemClick()
    }

    return (
        <div className={cn("pb-12 w-full flex flex-col h-full bg-[#FDFBF7]", className)}>
            <div className="space-y-4 py-8 flex-1">
                <div className="px-6 py-2">
                    <div className="space-y-1">
                        {isLoading && <div className="px-2 text-sm text-muted-foreground">Loading...</div>}

                        <button
                            onClick={() => {
                                const params = new URLSearchParams(searchParams)
                                params.delete("category")
                                router.replace(`${pathname}?${params.toString()}`)
                                if (onItemClick) onItemClick()
                            }}
                            className="w-full justify-start text-left font-bold px-2 py-1.5 rounded-lg transition-colors flex items-center gap-3 text-sm text-black hover:bg-black/5"
                        >
                            <span className="truncate">All Categories</span>
                        </button>

                        {!isLoading && categories?.length === 0 && (
                            <div className="px-2 text-sm text-muted-foreground">
                                No categories.
                            </div>
                        )}

                        {categories?.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => toggleCategory(category.id)}
                                className={cn(
                                    "w-full justify-start text-left font-medium px-2 py-1.5 rounded-lg transition-colors flex items-center gap-3 text-sm",
                                    currentCategoryId === category.id
                                        ? "bg-black/5 text-black"
                                        : "text-black/60 hover:bg-black/5"
                                )}
                            >
                                <span
                                    className="w-2.5 h-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: category.color }}
                                />
                                <span className="truncate">{category.name}</span>
                            </button>
                        ))}

                        <div className="pt-4 px-2">
                            <CreateCategoryDialog />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <UserNav />
            </div>
        </div>
    )
}

export function Sidebar({ className }: SidebarProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <>
            {/* Desktop Sidebar */}
            <div className={cn("hidden md:flex flex-col h-screen w-[240px] bg-[#FDFBF7]", className)}>
                <SidebarContent />
            </div>

            {/* Mobile Drawer Trigger */}
            <div className="md:hidden fixed top-4 left-4 z-40">
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Open sidebar">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="h-[85vh] bg-[#FDFBF7]">
                        <DrawerHeader className="sr-only">
                            <DrawerTitle>Sidebar Menu</DrawerTitle>
                            <DrawerDescription>Navigation links and categories</DrawerDescription>
                        </DrawerHeader>
                        <SidebarContent onItemClick={() => setOpen(false)} />
                    </DrawerContent>
                </Drawer>
            </div>
        </>
    )
}
