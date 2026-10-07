import { Scissors } from 'lucide-react';

function Sobre() {
  return (
    <section id="sobre" className="mt-12 sm:mt-16 lg:mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
        {/* Imagem */}
        <div className="relative rounded-2xl overflow-hidden h-64 sm:h-80 lg:h-96">
          <img
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1000&auto=format&fit=crop"
            alt="Interior da barbearia"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent"></div>
        </div>

        {/* Texto */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Scissors className="w-5 h-5 text-yellow-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-500">
              Sobre a Barbearia
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
            Mais que um corte, <br />
            <span className="text-yellow-400">uma experiência.</span>
          </h3>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-4">
            Aqui a gente não tem pressa. Cada cliente senta na cadeira sabendo
            que vai sair de lá com o visual afiado, o papo em dia e a sensação
            de ter sido bem atendido de verdade.
          </p>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mb-6">
            Do degradê clássico às mechas mais ousadas, nossos profissionais
            cuidam de cada detalhe. Ambiente climatizado, café na mão e aquela
            resenha que só barbearia de confiança tem.
          </p>

          <div className="flex items-center gap-6 pt-4 border-t border-zinc-800">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-yellow-400">
                10+
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">Anos de estrada</p>
            </div>
            <div className="w-px h-10 bg-zinc-800"></div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-yellow-400">
                5k+
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">Clientes atendidos</p>
            </div>
            <div className="w-px h-10 bg-zinc-800"></div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-yellow-400">
                2
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">Barbeiros</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Sobre;