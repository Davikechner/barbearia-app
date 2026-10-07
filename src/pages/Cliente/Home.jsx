import Header from '../../components/Cliente/Header';
import Hero from '../../components/Cliente/Hero';
import Servicos from '../../components/Cliente/Servicos';
import Galeria from '../../components/Cliente/Galeria';
import Features from '../../components/Cliente/Features';
import Sobre from '../../components/Cliente/Sobre';
import InfoBarbearia from '../../components/Cliente/InfoBarbearia';
import WhatsAppButton from '../../components/Cliente/WhatsAppButton';
import Footer from '../../components/Cliente/Footer';

function Home() {
  return (
    <div className="bg-zinc-950 text-zinc-100 antialiased min-h-screen">
      <Header />
      <main className="w-full">
        <Hero />

        {/* Serviços + Galeria */}
        <div className="max-w-5xl mx-auto lg:max-w-6xl px-4 sm:px-6">
          <Servicos />
          <Galeria />
        </div>

        {/* Faixa de Features — fora do container pra ocupar largura total */}
        <Features />

        {/* Sobre + Localização + WhatsApp */}
        <div className="max-w-5xl mx-auto lg:max-w-6xl px-4 sm:px-6">
          <Sobre />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-12 sm:mt-16 lg:mt-20">
            <InfoBarbearia />
            <div className="flex items-end">
              <WhatsAppButton />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;