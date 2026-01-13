import { Metadata } from "next"
import NewNoteClient from "./client"

export const metadata: Metadata = {
    title: "New Note",
}

export default function NewNotePage() {
    return <NewNoteClient />
}
