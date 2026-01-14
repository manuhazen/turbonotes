"use client"

import { useEffect } from "react"
import { useNote, useUpdateNote, useDeleteNote, useCategories } from "@/hooks/use-notes"
import { Button } from "@/components/ui/button"
import { CloseButton } from "@/components/ui/close-button"
import { Check, Trash2 } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CategorySelect } from "@/components/ui/category-select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    category: z.string().optional(),
})

export default function NoteClient({ id }: { id: string }) {
    // const { id } = use(params) // Passed as prop now
    const { data: note, isLoading, error } = useNote(id)
    const { data: categories } = useCategories() // We need categories for editing
    const updateNote = useUpdateNote()
    const deleteNote = useDeleteNote()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "",
        },
    })

    // Watch category for background color
    const selectedCategoryId = form.watch("category")

    // Populate form when note data is loaded
    useEffect(() => {
        if (note) {
            const categoryId = note.category ? String(note.category) : ""

            form.reset({
                title: note.title,
                description: note.description,
                category: categoryId,
            })
        }
    }, [note, form])

    function onSubmit(values: z.infer<typeof formSchema>) {
        updateNote.mutate({
            id,
            data: {
                title: values.title,
                description: values.description,
                category: values.category || null,
            }
        })
    }

    // Determine dynamic background color
    // Use form state, fallback to note's current color, or default
    const currentCategory = categories?.find(c => String(c.id) === String(selectedCategoryId))
    const bgColor = currentCategory ? currentCategory.color : (note?.category_color || "#FDFBF7")

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
                <div className="animate-pulse text-[#8D7B68]">Loading note...</div>
            </div>
        )
    }

    if (error || !note) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#FDFBF7] text-[#8D7B68]">
                <p>Note not found</p>
                <Button asChild variant="outline">
                    <Link href="/">Go Back</Link>
                </Button>
            </div>
        )
    }

    // Sort categories for consistency
    const sortedCategories = categories?.sort((a, b) => a.name.localeCompare(b.name)) || []

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8 flex flex-col transition-colors duration-300">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    onKeyDown={(e) => {
                        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                            e.preventDefault()
                            form.handleSubmit(onSubmit)()
                        }
                    }}
                    className="flex-1 flex flex-col h-full max-w-7xl mx-auto w-full"
                >

                    {/* Header Controls (Outside Card) */}
                    <div className="flex justify-between items-center mb-6 px-1">
                        <div className="flex items-center gap-2">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            {categories && categories.length > 0 ? (
                                                <CategorySelect
                                                    categories={sortedCategories}
                                                    placeholder="Select Category"
                                                    onChange={(val) => {
                                                        // Prevent automatic resets if value is invalid/not found
                                                        if (val) {
                                                            field.onChange(val)
                                                        }
                                                    }}
                                                    value={field.value}
                                                />
                                            ) : (
                                                <div className="h-10 w-[200px] bg-black/5 animate-pulse rounded-md" />
                                            )}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-[#8D7B68]/60 hover:text-red-500 hover:bg-red-50"
                                        disabled={deleteNote.isPending}
                                        aria-label="Delete Note"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-[#FDFBF7] border-[#D7CCC8]">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-[#5D4037]">Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-[#8D7B68]">
                                            This action cannot be undone. This will permanently delete your note.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="border-[#D7CCC8] text-[#8D7B68] hover:bg-[#F9F4E8] hover:text-[#5D4037]">Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => deleteNote.mutate(id)}
                                            className="bg-red-500 text-white hover:bg-red-600 border-red-600"
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>

                        <Link href="/">
                            <CloseButton />
                        </Link>
                    </div>

                    {/* Note Card Container */}
                    <div
                        className="flex-1 rounded-[32px] p-8 md:p-12 relative flex flex-col shadow-sm border border-black/5 transition-colors duration-300"
                        style={{ backgroundColor: bgColor }}
                    >
                        {/* Last Edited */}
                        <div className="absolute top-8 right-8 text-xs font-medium text-black/40">
                            Last Edited: {new Date(note.updated_at).toLocaleString()}
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
                                            className="shadow-none text-4xl md:text-5xl font-serif font-bold bg-transparent border-none px-0 placeholder:text-black/20 focus-visible:ring-0 h-auto tracking-tight mt-4"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Content Textarea */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="flex-1 mt-8">
                                    <FormControl>
                                        <Textarea
                                            placeholder="Type your note here..."
                                            className="shadow-none w-full h-full min-h-[400px] text-lg bg-transparent border-none px-0 resize-none placeholder:text-black/20 focus-visible:ring-0 leading-relaxed font-sans text-black/80"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Floating Save Button */}
                        <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2">
                            <span className="text-xs text-black/40 font-medium hidden md:block pointer-events-none select-none">
                                ⌘ + Enter
                            </span>
                            {/* Show save button when dirty? Or always? Let's show always for explicit save action to feel secure */}
                            <Button
                                type="submit"
                                size="icon"
                                className="rounded-full w-14 h-14 bg-[#333] text-white hover:bg-black shadow-lg"
                                disabled={updateNote.isPending || !form.formState.isDirty} // Only enable if dirty? Or always allow re-save? "Update it right away"
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
