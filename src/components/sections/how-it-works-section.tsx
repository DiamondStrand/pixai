import { UserPlus, Search, Download } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      icon: UserPlus,
      title: 'Skapa konto',
      description: 'Få en inbjudan och logga in.',
    },
    {
      icon: Search,
      title: 'Börja söka',
      description: 'Ange beskrivning och låt AI göra jobbet.',
    },
    {
      icon: Download,
      title: 'Ladda ner resultat',
      description: 'Få bilder redo för ditt projekt.',
    },
  ];

  return (
    <section className="flex flex-col py-16">
      <div className="flex flex-col max-w-4xl mx-auto w-full p-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Enkelt och snabbt att komma igång
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-4 flex items-center justify-center bg-[#10a37f]/10 rounded-full">
                <step.icon className="w-8 h-8 text-[#10a37f]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}