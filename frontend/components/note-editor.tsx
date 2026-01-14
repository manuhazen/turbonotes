"use client"

import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useDebouncedCallback } from "use-debounce"
import { Trash2 } from "lucide-react"
import Link from "next/link"

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

// Define Schema centrally (or import if moved to a shared schema file)
const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    category: z.string().optional(),
})

export type NoteFormData = z.infer<typeof formSchema>

interface NoteEditorProps {
    initialData?: NoteFormData
    categories?: { id: string, name: string, color: string }[]
    onSave: (data: NoteFormData) => void
    isSaving: boolean
    onDelete?: () => void
    isDeleting?: boolean
    lastEditedAt?: string
}

export function NoteEditor({
    initialData,
    categories,
    onSave,
    isSaving,
    onDelete,
    isDeleting,
    lastEditedAt
}: NoteEditorProps) {
    const form = useForm<NoteFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "",
            ...initialData
        },
    })

    // Reset form if initialData changes (e.g. data loaded)
    useEffect(() => {
        if (initialData) {
            // Only reset if we are switching notes or loading for first time
            // Strategy: Check if form is dirty? 
            // If explicit initialData passed, we usually want to sync to it unless user is typing.
            // But usually this component mounts with data ready or loading.

            // For now, simpler reset logic:
            form.reset({
                title: initialData.title || "",
                description: initialData.description || "",
                category: initialData.category || ""
            })
        }
    }, [initialData, form])

    const values = useWatch({ control: form.control }) as NoteFormData
    const selectedCategoryId = values.category

    // Sort categories
    const sortedCategories = categories?.slice().sort((a, b) => a.name.localeCompare(b.name)) || []

    // Background Color
    const currentCategory = categories?.find(c => String(c.id) === String(selectedCategoryId))
    const bgColor = currentCategory?.color || "#FDFBF7"

    // Debounce Save
    const debouncedSave = useDebouncedCallback((values: NoteFormData) => {
        if (!values.title) return
        onSave(values)
    }, 1000)

    useEffect(() => {
        if (form.formState.isDirty && values.title) {
            debouncedSave(values)
        }
    }, [values, debouncedSave, form.formState.isDirty])

    // Handle Cmd+Enter
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            if (values.title) {
                // Immediate save
                debouncedSave.flush()
            }
        }
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8 flex flex-col transition-colors duration-300">
            <Form {...form}>
                <form
                    className="flex-1 flex flex-col h-full max-w-7xl mx-auto w-full"
                    onKeyDown={handleKeyDown}
                    onSubmit={(e) => e.preventDefault()} // Prevent default submit
                >
                    {/* Header Controls */}
                    <div className="flex justify-between items-center mb-6 px-1">
                        <div className="flex items-center gap-2">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <CategorySelect
                                                categories={sortedCategories}
                                                placeholder="Select Category"
                                                onChange={field.onChange}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {onDelete && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-[#ef5350] hover:text-[#d32f2f] hover:bg-[#ef5350]/10"
                                            disabled={isDeleting}
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
                                                onClick={onDelete}
                                                className="bg-red-500 text-white hover:bg-red-600 border-red-600"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </div>

                        <Link href="/">
                            <CloseButton />
                        </Link>
                    </div>

                    {/* Note Card */}
                    <div
                        className="flex-1 rounded-[32px] p-8 md:p-12 relative flex flex-col shadow-sm border border-black/5 transition-colors duration-300"
                        style={{ backgroundColor: bgColor }}
                    >
                        {/* Last Edited or Saving Indicator */}
                        <div className="absolute top-8 right-8 text-xs font-medium text-black/40 transition-opacity duration-300">
                            {isSaving ? 'Saving...' : (lastEditedAt ? `Last Edited: ${new Date(lastEditedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '')}
                        </div>

                        {/* Title */}
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

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="flex-1 mt-8">
                                    <FormControl>
                                        <Textarea
                                            placeholder="Pour your heart out..." // Consistent placeholder
                                            className="shadow-none w-full h-full min-h-[400px] text-lg bg-transparent border-none px-0 resize-none placeholder:text-black/20 focus-visible:ring-0 leading-relaxed font-sans text-black/80"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>
        </div>
    )
}
