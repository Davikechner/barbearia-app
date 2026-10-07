import { Scissors, MapPin, Clock, Phone, Instagram } from 'lucide-react';

function Footer() {
  return (
    <footer className="mt-12 sm:mt-16 lg:mt-20 border-t border-zinc-800 bg-zinc-950/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Marca */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                <Scissors className="w-4 h-4 text-zinc-950" strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="font-bold text-white leading-tight">
                  Gui Barbeiro
                </h4>
                <p className="text-[10px] text-zinc-500">Estilo & Tradição</p>
              </div>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Barbearia premium com atendimento personalizado e ambiente
              acolhedor.
            </p>
          </div>

          {/* Endereço */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-yellow-500" />
              Endereço
            </h5>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Rua das Palmeiras, 340
              <br />
              Centro — São Paulo/SP
            </p>
          </div>

          {/* Horário */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-yellow-500" />
              Horário
            </h5>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Segunda a Sábado
              <br />
              09:00 às 20:00
            </p>
            <p className="text-[10px] text-zinc-600 mt-2">Domingo fechado</p>
          </div>

          {/* Contato */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-yellow-500" />
              Contato
            </h5>
            <a
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-400 hover:text-yellow-400 transition-colors block mb-2"
            >
              (00) 00000-0000
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-yellow-400 transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
              @guibarbeiro
            </a>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-zinc-600">
            © {new Date().getFullYear()} Gui Barbeiro. Todos os direitos
            reservados.
          </p>
          <p className="text-[10px] text-zinc-700">
            Feito com dedicação para a rotina da barbearia
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;