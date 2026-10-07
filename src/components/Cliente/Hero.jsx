import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full">
      <div className="relative h-[380px] sm:h-[440px] lg:h-[520px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1600&auto=format&fit=crop"
          alt="Corte em barbearia real"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/20"></div>

        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14 lg:pb-20">
            <div className="max-w-xl text-center sm:text-left">
              <span className="inline-block px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-semibold rounded-full mb-3 backdrop-blur-sm">
                Barbearia Premium
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                Seu estilo começa aqui.
              </h2>
              <p className="text-sm sm:text-base text-zinc-300 mb-6 max-w-md">
                Profissionais especializados em cortes modernos, clássicos e barbas
                de respeito com atendimento de alto padrão.
              </p>
              <button
                onClick={() => navigate('/agendar/servico')}
                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-zinc-950 font-bold py-3.5 sm:py-4 px-6 sm:px-8 rounded-2xl shadow-lg shadow-yellow-500/25 transition-all transform active:scale-95"
              >
                <Calendar className="w-5 h-5" />
                <span className="text-sm sm:text-base tracking-wide">
                  Agendar Horário Online
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;