"use client"


import { useRouter } from "next/navigation"
import { useCreateNote, useCategories } from "@/hooks/use-notes"
import { NoteEditor, NoteFormData } from "@/components/note-editor"

export default function NewNoteClient() {
    const createNote = useCreateNote()
    const { data: rawCategories } = useCategories()
    const router = useRouter()

    const categories = rawCategories || []

    // Auto-select first category logic needs to be passed down or handled?
    // NoteEditor doesn't enforce default category unless passed in initialData.
    // We can compute default category here.

    // Actually, NoteEditor resets form when initialData changes.
    // We can pass a computed initialData object once categories is loaded.
    const sortedCategories = categories.slice().sort((a, b) => a.name.localeCompare(b.name))
    const defaultCategoryId = sortedCategories.length > 0 ? String(sortedCategories[0].id) : ""

    // Ideally we want to pass this as initialData.
    // But categories might load later.
    // If we pass initialData with category set, NoteEditor will use it.

    const handleSave = (values: NoteFormData) => {
        createNote.mutate({
            title: values.title,
            description: values.description,
            category: values.category || null,
        }, {
            onSuccess: (data) => {
                // Redirect to edit mode
                router.replace(`/note/${data.id}`)
            }
        })
    }

    return (
        <NoteEditor
            initialData={{ title: "", description: "", category: defaultCategoryId }}
            categories={categories}
            onSave={handleSave}
            isSaving={createNote.isPending}
        />
    )
}


