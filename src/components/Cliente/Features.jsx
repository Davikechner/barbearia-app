import { Calendar, Users, Award, Clock } from 'lucide-react';

const FEATURES = [
  {
    titulo: 'AGENDA',
    desc: 'organizada em tempo real',
    Icone: Calendar,
  },
  {
    titulo: 'CLIENTES',
    desc: 'com histórico e retorno',
    Icone: Users,
  },
  {
    titulo: 'QUALIDADE',
    desc: 'atendimento profissional',
    Icone: Award,
  },
  {
    titulo: 'ONLINE',
    desc: 'agendamento 24 horas',
    Icone: Clock,
  },
];

function Features() {
  return (
    <section className="mt-12 sm:mt-16 lg:mt-20 border-y border-zinc-800/70">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <div
            key={f.titulo}
            className={`px-5 sm:px-8 py-6 sm:py-8 ${
              i < FEATURES.length - 1 ? 'border-r border-zinc-800/70' : ''
            } ${i < 2 ? 'border-b lg:border-b-0 border-zinc-800/70' : ''}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <f.Icone className="w-4 h-4 text-yellow-500 shrink-0" />
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                {f.titulo}
              </h4>
            </div>
            <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;