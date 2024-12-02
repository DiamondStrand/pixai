import { ImageCard } from './ImageCard'

export function ImageGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Exempel på hur det kan se ut med statisk data */}
      {[1,2,3].map((_, i) => (
        <div key={i} className="aspect-square relative overflow-hidden rounded-lg">
          <ImageCard 
            image={{
              id: `${i}`,
              url: '/placeholder.jpg',
              title: 'Exempelbild',
              photographer: 'Fotograf Namn',
              description: 'Beskrivning av bilden'
            }}
          />
        </div>
      ))}
    </div>
  )
}
