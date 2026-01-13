"use client"

import * as React from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useCategories } from "@/hooks/use-notes"
import { CreateCategoryDialog } from "@/components/create-category-dialog"
import { UserNav } from "@/components/user-nav"
import { CategorySelect } from "@/components/ui/category-select" // Re-using but maybe better to make a list since sidebar

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
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
    }

    return (
        <div className={cn("pb-12 w-[240px] flex flex-col h-screen bg-[#FDFBF7]", className)}>
            <div className="space-y-4 py-8 flex-1">
                <div className="px-6 py-2">
                    <div className="space-y-1">
                        {isLoading && <div className="px-2 text-sm text-muted-foreground">Loading...</div>}

                        <button
                            onClick={() => {
                                const params = new URLSearchParams(searchParams)
                                params.delete("category")
                                router.replace(`${pathname}?${params.toString()}`)
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
                                {/* Optional: Add count here if available in the future */}
                            </button>
                        ))}

                        <div className="pt-4 px-2">
                            <CreateCategoryDialog />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center gap-3">
                    <UserNav />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-[#8D7B68]">My Account</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
