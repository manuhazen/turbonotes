import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CloseButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function CloseButton({ className, ...props }: CloseButtonProps) {
    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8 text-[#8D7B68] hover:bg-[#8D7B68]/10", className)}
            {...props}
        >
            <X className="h-6 w-6" />
        </Button>
    )
}
