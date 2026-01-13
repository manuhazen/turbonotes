import * as React from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Category {
    id: string;
    name: string;
    color: string;
}

interface CategorySelectProps {
    categories: Category[];
    placeholder?: string;
    onChange?: (value: string) => void;
    defaultValue?: string;
}

export function CategorySelect({ categories, placeholder = "Select category", onChange, defaultValue }: CategorySelectProps) {
    return (
        <Select onValueChange={onChange} defaultValue={defaultValue}>
            <SelectTrigger className="w-[200px] bg-[#F9F4E8] border-[#D7CCC8] text-[#8D7B68] rounded-md h-10">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-[#FFFFFE] border-[#EDDDD4]">
                {categories.map((category) => (
                    <SelectItem
                        key={category.id}
                        value={category.id}
                        className="text-[#8D7B68] focus:bg-[#F9F4E8] focus:text-[#8D7B68] cursor-pointer"
                    >
                        <div className="flex items-center gap-2">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: category.color }}
                            />
                            <span>{category.name}</span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
