import { MessageCircle } from 'lucide-react';

function WhatsAppButton() {
  return (
    <section className="mt-6 lg:mt-0 w-full">
      <a
        href="https://wa.me/5500000000000"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-4 px-5 rounded-2xl flex items-center justify-center gap-2 text-sm sm:text-base transition-all shadow-md"
      >
        <MessageCircle className="w-5 h-5" />
        <span>Falar no WhatsApp</span>
      </a>
    </section>
  );
}

export default WhatsAppButton;