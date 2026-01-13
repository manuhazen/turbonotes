import { cn } from "@/lib/utils"

interface NoteCardProps {
    title: string;
    content: string;
    date: string;
    category: {
        name: string;
        color: string; // Hex code or CSS color
    };
    className?: string; // For adding extra styles
}

export function NoteCard({ title, content, date, category, className }: NoteCardProps) {
    return (
        <div
            className={cn("rounded-xl border-2 border-black/10 shadow-sm p-6 flex flex-col gap-4 w-full hover:border-black/20 transition-colors", className)}
            style={{ backgroundColor: category.color }}
        >
            <div className="flex justify-between items-center text-xs font-medium text-black/60">
                <span className="flex gap-2">
                    <span className="font-bold">{date}</span>
                    <span>{category.name}</span>
                </span>
            </div>

            <h3 className="text-2xl font-serif font-bold text-black leading-tight">
                {title}
            </h3>

            <p className="text-sm text-black/80 line-clamp-4 font-sans leading-relaxed">
                {content}
            </p>
        </div>
    )
}
