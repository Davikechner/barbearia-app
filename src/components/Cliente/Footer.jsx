function Footer() {
  return (
    <footer className="mt-12 sm:mt-16 lg:mt-20 border-t border-zinc-800 bg-zinc-950/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-zinc-600 text-center sm:text-left">
            © {new Date().getFullYear()} Gui Barbeiro · Estilo & Tradição
          </p>
          <p className="text-[11px] text-zinc-700 text-center sm:text-right">
            Feito com dedicação para a rotina da barbearia
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;