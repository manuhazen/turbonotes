
import Image from "next/image";

interface AuthHeaderProps {
    imageSrc: string;
    imageAlt: string;
    title: string;
}

export function AuthHeader({ imageSrc, imageAlt, title }: AuthHeaderProps) {
    return (
        <div className="flex flex-col items-center gap-6 mb-8 text-center">
            <div className="relative w-48 h-48">
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    className="object-contain"
                    priority
                />
            </div>
            <h1 className="text-4xl font-serif text-[#8D7B68] font-bold tracking-tight">
                {title}
            </h1>
        </div>
    );
}
