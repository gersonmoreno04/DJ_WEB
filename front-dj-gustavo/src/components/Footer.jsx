export default function Footer() {
    return (
        <footer className="w-full py-16 bg-surface border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 md:px-16 flex flex-col md:flex-row justify-between items-start gap-12">

                {/* Marca */}
                <div className="max-w-xs">
          <span className="font-headline-md text-2xl font-black text-on-surface tracking-tighter">
            GDL PRODUCTION
          </span>
                    <p className="text-base text-on-surface-variant mt-4">
                        Elevando la experiencia sonora y visual en la Ciudad de México desde 2018.
                    </p>
                </div>

                {/* Enlaces */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                    <div className="flex flex-col space-y-4">
                        <span className="text-sm text-on-surface font-bold uppercase tracking-widest">Navegación</span>
                        <a className="text-base text-on-surface-variant hover:text-on-surface transition-colors" href="#">Servicios</a>
                        <a className="text-base text-on-surface-variant hover:text-on-surface transition-colors" href="#">Equipamiento</a>
                        <a className="text-base text-on-surface-variant hover:text-on-surface transition-colors" href="#">Eventos</a>
                    </div>
                    <div className="flex flex-col space-y-4">
                        <span className="text-sm text-on-surface font-bold uppercase tracking-widest">Legal</span>
                        <a className="text-base text-on-surface-variant hover:text-on-surface transition-colors" href="#">Términos</a>
                        <a className="text-base text-on-surface-variant hover:text-on-surface transition-colors" href="#">Privacidad</a>
                    </div>
                    <div className="flex flex-col space-y-4">
                        <span className="text-sm text-on-surface font-bold uppercase tracking-widest">Social</span>
                        <a className="text-base text-on-surface-variant hover:text-secondary transition-colors" href="#">Instagram</a>
                        <a className="text-base text-on-surface-variant hover:text-secondary transition-colors" href="#">Facebook</a>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="max-w-7xl mx-auto px-4 md:px-16 mt-16 pt-8 border-t border-white/5 text-center md:text-left">
        <span className="text-xs text-on-surface-variant opacity-50 uppercase tracking-[0.2em]">
          © 2026 GDL PRODUCTION. ENGINEERED FOR HIGH-INTENSITY EVENTS.
        </span>
            </div>
        </footer>
    );
}