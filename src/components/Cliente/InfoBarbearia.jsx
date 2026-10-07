import { useState } from 'react';
import { MapPin, Clock, ExternalLink, X } from 'lucide-react';

function InfoBarbearia() {
  const [mapaAberto, setMapaAberto] = useState(false);

  const lat = -23.5505;
  const lng = -46.6333;
  const endereco = 'Rua das Palmeiras, 340 - Centro';

  return (
    <>
      <section id="localizacao" className="mt-12 sm:mt-16 lg:mt-20">
        <h3 className="font-bold text-xl sm:text-2xl lg:text-3xl text-white mb-5 sm:mb-8 flex items-center gap-2">
          <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
          Onde Estamos
        </h3>

        <div className="bg-zinc-900 border border-zinc-800 p-5 sm:p-6 rounded-2xl space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 text-yellow-400 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                Endereço
              </h4>
              <p className="text-sm text-zinc-400 mb-3">{endereco}</p>
              <button
                onClick={() => setMapaAberto(true)}
                className="inline-flex items-center gap-1.5 text-sm text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Ver no mapa
              </button>
            </div>
          </div>

          <div className="border-t border-zinc-800/80 pt-4 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 text-yellow-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                Horário de Funcionamento
              </h4>
              <p className="text-sm text-zinc-400">
                Segunda a Sábado: 09:00 às 20:00
              </p>
            </div>
          </div>
        </div>
      </section>

      {mapaAberto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setMapaAberto(false)}
        >
          <div
            className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-yellow-400" />
                Nossa Localização
              </h3>
              <button
                onClick={() => setMapaAberto(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-xl overflow-hidden border border-zinc-800 h-80 sm:h-96">
              <iframe
                title="Mapa da barbearia"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`}
              ></iframe>
            </div>
            <a
              href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold py-3 rounded-xl border border-zinc-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Abrir no OpenStreetMap
            </a>
          </div>
        </div>
      )}
    </>
  );
}

export default InfoBarbearia;