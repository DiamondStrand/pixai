import { Search, Tags, Image, MessagesSquare } from 'lucide-react';

const features = [
  {
    title: "Sök efter bilder med AI",
    description: "Använd avancerad AI för att hitta exakt de bilder du letar efter",
    icon: Search
  },
  {
    title: "Automatisk kategorisering och taggning",
    description: "Låt AI:n organisera och tagga ditt bildbibliotek automatiskt",
    icon: Tags
  },
  {
    title: "Stöd för olika format och storlekar",
    description: "Hantera alla typer av bildformat och storlekar sömlöst",
    icon: Image
  },
  {
    title: "Interaktiv dialog med AI",
    description: "Förfina dina sökresultat genom naturlig konversation med AI",
    icon: MessagesSquare
  }
];

export function FeaturesSection() {
  return (
    <section className="flex flex-col py-16">
      <div className="flex flex-col max-w-7xl mx-auto w-full p-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 ">Vad kan PixAI göra för dig?</h2>
          <p className="dark:text-gray-300 text-gray-600 max-w-2xl mx-auto">
            PixAI revolutionerar hur du söker och organiserar bilder med kraftfull AI-teknologi
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex items-start p-6 bg-[#444654] rounded-lg shadow-lg"
            >
              <feature.icon className="w-6 h-6 text-[#10a37f] mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
