"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Check } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"
import { useRouter } from "next/navigation"

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
    const router = useRouter()

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

    // Watch values for auto-save
    const values = form.watch()
    const selectedCategoryId = values.category

    const debouncedCreate = useDebouncedCallback((values: z.infer<typeof formSchema>) => {
        if (!values.title) return // Don't create without title

        createNote.mutate({
            title: values.title,
            description: values.description,
            category: values.category || null,
        }, {
            onSuccess: (data) => {
                // Redirect to edit mode to prevent duplicates
                router.replace(`/note/${data.id}`)
            }
        })
    }, 1000)

    // Trigger debounce when values change
    useEffect(() => {
        if (values.title) {
            debouncedCreate(values)
        }
    }, [values, debouncedCreate])


    // Auto-select first category
    useEffect(() => {
        if (categories && categories.length > 0 && !selectedCategoryId) {
            const firstCategory = categories[0]
            form.setValue("category", String(firstCategory.id))
        }
    }, [categories, selectedCategoryId, form])

    // Determine dynamic background color
    const selectedCategory = categories?.find(c => String(c.id) === String(selectedCategoryId))
    const bgColor = selectedCategory?.color || "#FDFBF7" // Default beige

    // Prevent enter to submit
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
        }
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8 flex flex-col transition-colors duration-300">
            <Form {...form}>
                <form
                    className="flex-1 flex flex-col h-full max-w-7xl mx-auto w-full"
                    onKeyDown={handleKeyDown}
                >

                    {/* Header Controls */}
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

                        {/* Loading Indicator instead of Save Button */}
                        <div className="absolute bottom-8 right-8">
                            {createNote.isPending && (
                                <div className="text-black/40 text-sm font-medium animate-pulse">
                                    Saving...
                                </div>
                            )}
                        </div>
                    </div>

                </form>
            </Form>
        </div>
    )
}

