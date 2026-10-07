import { Camera } from 'lucide-react';

function Galeria() {
  const fotos = [
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512861583893-b430638590d9?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=600&auto=format&fit=crop',
  ];

  return (
    <section id="trabalhos" className="mt-12 sm:mt-16 lg:mt-20">
      <h3 className="font-bold text-xl sm:text-2xl lg:text-3xl text-white mb-5 sm:mb-8 flex items-center gap-2">
        <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
        Nossos Trabalhos
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {fotos.map((url, i) => (
          <div
            key={i}
            className="aspect-square rounded-2xl overflow-hidden bg-zinc-800 group"
          >
            <img
              src={url}
              alt={`Trabalho ${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Galeria;