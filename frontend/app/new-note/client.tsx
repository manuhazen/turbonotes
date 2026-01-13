"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CloseButton } from "@/components/ui/close-button"
import { CategorySelect } from "@/components/ui/category-select"
import { useCreateNote, useCategories } from "@/hooks/use-notes"
import Link from "next/link"
import { useEffect } from "react"

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    category: z.string().optional(),
})

export default function NewNoteClient() {
    const createNote = useCreateNote()
    const { data: rawCategories } = useCategories()

    // Sort categories alphabetically
    const categories = rawCategories?.sort((a, b) => a.name.localeCompare(b.name))

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "",
        },
    })

    // Watch category for auto-selection and background color
    const selectedCategoryId = form.watch("category")

    // Auto-select first category
    useEffect(() => {
        if (categories && categories.length > 0 && !selectedCategoryId) {
            const firstCategory = categories[0]
            form.setValue("category", String(firstCategory.id)) // Ensure string
        }
    }, [categories, selectedCategoryId, form])

    // Determine dynamic background color
    const selectedCategory = categories?.find(c => String(c.id) === String(selectedCategoryId))
    const bgColor = selectedCategory?.color || "#FDFBF7" // Default beige

    function onSubmit(values: z.infer<typeof formSchema>) {
        createNote.mutate({
            title: values.title,
            description: values.description,
            category: values.category || null,
        })
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8 flex flex-col transition-colors duration-300">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col h-full max-w-7xl mx-auto w-full">

                    {/* Header Controls (Outside Card) */}
                    <div className="flex justify-between items-center mb-6 px-1">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <CategorySelect
                                            categories={categories || []}
                                            placeholder="Select Category"
                                            onChange={(val) => {
                                                field.onChange(val)
                                            }}
                                            value={field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Link href="/">
                            <CloseButton />
                        </Link>
                    </div>

                    {/* Note Card Container */}
                    <div
                        className="flex-1 rounded-[32px] p-8 md:p-12 relative flex flex-col shadow-sm transition-colors duration-300"
                        style={{ backgroundColor: bgColor }}
                    >
                        {/* Last Edited (Placeholder for new note) */}
                        <div className="absolute top-8 right-8 text-xs font-medium text-black/40">
                            {/* New Note */}
                        </div>

                        {/* Title Input */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Note Title"
                                            className="shadow-none text-2xl md:text-4xl font-serif font-bold bg-transparent border-none px-0 placeholder:text-black/20 focus-visible:ring-0 h-auto tracking-tight"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description Textarea */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="flex-1 mt-8">
                                    <FormControl>
                                        <Textarea
                                            placeholder="Pour your heart out..."
                                            className="shadow-none w-full h-full min-h-[400px] text-lg bg-transparent border-none px-0 resize-none placeholder:text-black/20 focus-visible:ring-0 leading-relaxed font-sans"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Floating Action Button */}
                        <div className="absolute bottom-8 right-8 flex gap-4">
                            <Button
                                type="submit"
                                size="icon"
                                className="rounded-full w-14 h-14 bg-[#333] text-white hover:bg-black shadow-lg"
                                disabled={createNote.isPending}
                                aria-label="Save Note"
                            >
                                <Check className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>

                </form>
            </Form>
        </div>
    )
}
