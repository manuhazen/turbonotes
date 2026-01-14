import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

import { Sidebar } from "@/components/sidebar"
import { NotesList } from "@/components/notes-list"
import { Button } from "@/components/ui/button"

export default function Home() {
  console.log('process.env.', process.env)
  return (
    <div className="flex h-screen bg-[#FDFBF7]">
      <Suspense fallback={<div className="w-[240px] border-r border-[#EDDDD4] h-screen bg-[#FDFBF7]" />}>
        <Sidebar />
      </Suspense>
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex items-center justify-end p-8 pb-4">
          <Button asChild className="rounded-full bg-transparent text-[#8D7B68] border border-[#8D7B68] hover:bg-[#8D7B68] hover:text-[#FDFBF7] h-12 px-6 font-medium text-base shadow-md transition-all">
            <Link href="/new-note">
              <Plus className="mr-2 h-5 w-5" />
              New Note
            </Link>
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-4">
          <Suspense fallback={<div>Loading notes...</div>}>
            <NotesList />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
