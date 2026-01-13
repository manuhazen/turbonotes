"use client"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLogout, useUser } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"

export function UserNav() {
    const logout = useLogout()
    const { data: user, isLoading } = useUser()

    // Get initials
    const initials = user
        ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || 'ME'
        : '...'

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border border-[#D7CCC8]">
                        {/* We don't have user images yet, so just fallback */}
                        {/* <AvatarImage src="/avatars/01.png" alt="@shadcn" /> */}
                        <AvatarFallback className="bg-[#F9F4E8] text-[#8D7B68] font-bold">
                            {isLoading ? '...' : initials}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {isLoading ? 'Loading...' : `${user?.first_name} ${user?.last_name}`}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout.mutate()} className="text-red-600 focus:text-red-600 cursor-pointer">
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
