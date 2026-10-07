import Header from '../../components/Cliente/Header';
import Hero from '../../components/Cliente/Hero';
import Servicos from '../../components/Cliente/Servicos';
import Galeria from '../../components/Cliente/Galeria';
import InfoBarbearia from '../../components/Cliente/InfoBarbearia';
import WhatsAppButton from '../../components/Cliente/WhatsAppButton';

function Home() {
  return (
    <div className="bg-zinc-950 text-zinc-100 antialiased min-h-screen">
      <Header />
      <main className="w-full">
        <Hero />
        <div className="max-w-5xl mx-auto lg:max-w-6xl px-4 sm:px-6">
          <Servicos />
          <Galeria />
        </div>
        <div className="max-w-5xl mx-auto lg:max-w-6xl px-4 sm:px-6 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <InfoBarbearia />
            <div className="flex items-end">
              <WhatsAppButton />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;