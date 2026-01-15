"use client"

import { useNote, useUpdateNote, useDeleteNote, useCategories } from "@/hooks/use-notes"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { NoteEditor, NoteFormData } from "@/components/note-editor"

export default function NoteClient({ id }: { id: string }) {
    const { data: note, isLoading, error } = useNote(id)
    const { data: categories } = useCategories()
    const updateNote = useUpdateNote()
    const deleteNote = useDeleteNote()

    const handleSave = (values: NoteFormData) => {
        updateNote.mutate({
            id,
            data: {
                title: values.title,
                description: values.description,
                category: values.category || null,
            }
        })
    }

    const handleDelete = () => {
        deleteNote.mutate(id)
    }

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

    const initialData: NoteFormData = {
        title: note.title,
        description: note.description,
        category: note.category ? String(note.category) : undefined
    }

    return (
        <NoteEditor
            key={id}
            initialData={initialData}
            categories={categories}
            onSave={handleSave}
            isSaving={updateNote.isPending}
            onDelete={handleDelete}
            isDeleting={deleteNote.isPending}
            lastEditedAt={note.updated_at}
        />
    )
}
