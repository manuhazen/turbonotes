import { Metadata } from "next"
import NoteClient from "./client"

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Edit Note",
    }
}

export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return <NoteClient id={id} />
}
