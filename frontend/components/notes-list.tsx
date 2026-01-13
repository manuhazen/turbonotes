"use client"

import { useSearchParams } from "next/navigation"
import { useNotes } from "@/hooks/use-notes"
import { NoteCard } from "@/components/ui/note-card"
import Link from "next/link"

export function NotesList() {
    const searchParams = useSearchParams()
    const categoryId = searchParams.get("category") || undefined
    const { data: notes, isLoading, error } = useNotes(categoryId)

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-48 rounded-3xl bg-[#F9F4E8] animate-pulse" />
                ))}
            </div>
        )
    }

    if (error) {
        return <div className="text-red-500">Failed to load notes</div>
    }

    if (!notes?.length) {
        return (
            <div className="text-center text-muted-foreground py-12">
                No notes found. Create one to get started!
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {notes.map((note) => (
                <Link key={note.id} href={`/note/${note.id}`}>
                    <NoteCard
                        title={note.title}
                        date={new Date(note.updated_at).toLocaleDateString()}
                        category={{
                            name: note.category_name || "Uncategorized",
                            color: note.category_color || "#F9F4E8"
                        }}
                        content={note.description}
                    />
                </Link>
            ))}
        </div>
    )
}
