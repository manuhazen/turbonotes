"use client"


import { useRouter } from "next/navigation"
import { useCreateNote, useCategories } from "@/hooks/use-notes"
import { NoteEditor, NoteFormData } from "@/components/note-editor"

export default function NewNoteClient() {
    const createNote = useCreateNote()
    const { data: rawCategories } = useCategories()
    const router = useRouter()

    const categories = rawCategories || []

    const sortedCategories = categories.slice().sort((a, b) => a.name.localeCompare(b.name))
    const defaultCategoryId = sortedCategories.length > 0 ? String(sortedCategories[0].id) : ""

    const handleSave = (values: NoteFormData) => {
        createNote.mutate({
            title: values.title,
            description: values.description,
            category: values.category || null,
        }, {
            onSuccess: (data) => {
                router.replace(`/note/${data.id}`)
            }
        })
    }

    return (
        <NoteEditor
            key={defaultCategoryId}
            initialData={{ title: "", description: "", category: defaultCategoryId }}
            categories={categories}
            onSave={handleSave}
            isSaving={createNote.isPending}
        />
    )
}


