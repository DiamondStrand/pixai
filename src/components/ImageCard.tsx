import Image from 'next/image'

interface ImageResult {
    id: string
    url: string
    title: string
    photographer: string
    description?: string
    }

interface ImageCardProps {
    image: ImageResult
}
  
export function ImageCard({ image }: ImageCardProps) {
return (
    <div className="group relative h-full">
    <Image
        src={image.url}
        alt={image.title}
        fill
        className="object-cover transition-all group-hover:scale-105"
    />
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
        <h3 className="text-white font-medium">{image.title}</h3>
        <p className="text-white/80 text-sm">{image.photographer}</p>
    </div>
    </div>
)
}