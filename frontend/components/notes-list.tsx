"use client"

import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { useNotes } from "@/hooks/use-notes"
import { NoteCard } from "@/components/ui/note-card"
import Link from "next/link"
import { humanizeDate } from "@/lib/utils"

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
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <Image
                    src="/bobba.png"
                    alt="Waiting for notes"
                    width={288}
                    height={288}
                    className="w-72 h-auto object-contain"
                />
                <p className="text-[#8D7B68] text-xl md:text-2xl font-medium tracking-tight">
                    I’m just here waiting for your charming notes...
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {notes.map((note) => (
                <Link key={note.id} href={`/note/${note.id}`} className="h-full block">
                    <NoteCard
                        title={note.title}
                        date={humanizeDate(note.updated_at)}
                        category={{
                            name: note.category_name || "Uncategorized",
                            color: note.category_color || "#F9F4E8"
                        }}
                        content={note.description}
                        className="h-full"
                    />
                </Link>
            ))}
        </div>
    )
}
