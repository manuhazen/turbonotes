"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ColorPicker, THEME_COLORS } from "@/components/color-picker"
import { useCreateCategory, useCategories } from "@/hooks/use-notes"

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    color: z.string().min(1, "Color is required"),
})

export function CreateCategoryDialog() {
    const [open, setOpen] = useState(false)
    const createCategory = useCreateCategory()
    const { data: categories } = useCategories() // Get existing categories

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            color: THEME_COLORS[0],
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Check for duplicates
        const normalizedName = values.name.trim().toLowerCase()
        const exists = categories?.some((cat: { name: string }) => cat.name.toLowerCase() === normalizedName)

        if (exists) {
            form.setError("name", {
                type: "manual",
                message: "Category already exists"
            })
            return
        }

        createCategory.mutate(values, {
            onSuccess: () => {
                setOpen(false)
                form.reset()
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start gap-2 border-dashed bg-transparent hover:bg-[#F9F4E8] text-[#8D7B68]">
                    <Plus className="h-4 w-4" />
                    New Category
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#FFFFFE] border-[#EDDDD4]">
                <DialogHeader>
                    <DialogTitle>Create Category</DialogTitle>
                    <DialogDescription>
                        Add a new category to organize your notes.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Work, Personal, etc." className="bg-[#F9F4E8] border-[#D7CCC8]" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <FormControl>
                                        <ColorPicker value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" className="bg-[#f4eadd] text-[#8D7B68] hover:bg-[#eaddcf] border border-[#8D7B68]">
                                {createCategory.isPending ? "Creating..." : "Create Category"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
