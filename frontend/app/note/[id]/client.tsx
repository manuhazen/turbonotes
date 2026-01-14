"use client"

import { useEffect } from "react"
import { useNote, useUpdateNote, useDeleteNote, useCategories } from "@/hooks/use-notes"
import { Button } from "@/components/ui/button"
import { CloseButton } from "@/components/ui/close-button"
import { Check, Trash2 } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"
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

    // Watch values for auto-save
    const values = form.watch()
    const selectedCategoryId = values.category

    const debouncedUpdate = useDebouncedCallback((values: z.infer<typeof formSchema>) => {
        if (!values.title) return

        updateNote.mutate({
            id,
            data: {
                title: values.title,
                description: values.description,
                category: values.category || null,
            }
        })
    }, 1000)

    // Trigger debounce when values change
    useEffect(() => {
        // Only trigger if form is dirty or we have values (and note is loaded)
        if (note && form.formState.isDirty) {
            debouncedUpdate(values)
        }
    }, [values, debouncedUpdate, note, form.formState.isDirty])


    // Populate form when note data is loaded
    useEffect(() => {
        if (note) {
            const categoryId = note.category ? String(note.category) : ""

            // Only reset if not dirty to avoid overwriting user typing if re-fetch happens?
            // Actually, keep simple: only reset on initial load or if id changes.
            // But isLoading handles initial load. 
            // Better to check if values match to avoid loop? 
            // useForm defaultValues handles initial. reset handles updates.
            // If we are auto-saving, local state is truth.
            // So only reset if *new* note loaded (id changed) or first load.
            // checking note.id vs id prop is good but id prop doesn't change here.
            // We can rely on form.reset only running once per note load ideally.
            // But note object technically changes on update because of updated_at.
            // We should NOT reset form if form is dirty?
            if (!form.formState.isDirty) {
                form.reset({
                    title: note.title,
                    description: note.description,
                    category: categoryId,
                })
            }
        }
    }, [note, form]) // Removing form.formState.isDirty from deps to avoid loop? No, inside is fine.

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Manual submit if needed, but we rely on auto-save
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

    // Prevent enter = submit
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            // Maybe force immediate save?
            debouncedUpdate.flush()
        }
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8 flex flex-col transition-colors duration-300">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    onKeyDown={handleKeyDown}
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
                                        className="h-8 w-8 text-[#ef5350] hover:text-[#d32f2f] hover:bg-[#ef5350]/10"
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
                            {updateNote.isPending ? 'Saving...' : `Last Edited: ${new Date(note.updated_at).toLocaleString()}`}
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

                        {/* No submit button here anymore */}
                    </div>
                </form>
            </Form>
        </div>
    )
}

