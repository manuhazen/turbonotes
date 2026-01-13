"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export const THEME_COLORS = [
    "#EF9C66", // Orange
    "#FCDC94", // Yellow
    "#78ABA8", // Teal
    "#C8CFA0", // Olive
    "#F694C1", // Pink
    "#A3C9FA", // Blue
    "#D9A5B3", // Rose
    "#B7C9F2", // Periwinkle
    "#C3B1E1", // Lavender
    "#F1D4D4", // Pale Pink
    "#A0E7E5", // Turquoise
    "#E6E6E6", // Grey
]

interface ColorPickerProps {
    value: string
    onChange: (color: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
    return (
        <div className="grid grid-cols-6 gap-2">
            {THEME_COLORS.map((color) => (
                <button
                    key={color}
                    type="button"
                    className={cn(
                        "h-8 w-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform hover:scale-110",
                        value === color && "ring-2 ring-offset-2 ring-[#8D7B68]"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => onChange(color)}
                >
                    {value === color && (
                        <Check className="h-4 w-4 text-white mx-auto" strokeWidth={3} />
                    )}
                    <span className="sr-only">Select color {color}</span>
                </button>
            ))}
        </div>
    )
}
