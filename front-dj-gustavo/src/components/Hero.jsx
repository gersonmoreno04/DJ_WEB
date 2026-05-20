export default function Hero() {
    return (
        <header className="relative min-h-screen flex items-center pt-16 md:pt-20 overflow-hidden bg-background">
            <div className="absolute inset-0 z-0">
                <img
                    className="w-full h-full object-cover opacity-40 md:opacity-50"
                    alt="High-energy electronic music festival stage"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDp7Vx0yQQT-rY1nEnRgifku7o0UY5HkHJS7IDJDwQK_jy18NvhlEF6vuhhFWUByZxCJRGZObnKUu-qm4GMlwo0G6anXUj11_oQudfzgZ6NfVvsJF5TAVBzAKDXTR7bb_pyvSLvVSqqNXdSWKQITCtzROjU0j6xybnBtG_zpyuHi5zg0PWCnEUeiK31ponrnPJmfTfjDiq4LjWSfAIB5mb9AjT3rfDAvaFbzmevUorY47Xul4jJQGZxqoyhQ6swqwqRFfIkH4ReTmM"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-margin-desktop w-full py-20 md:py-0">
                <div className="max-w-4xl">
                    <h1 className="font-headline-2xl text-4xl sm:text-5xl md:text-7xl text-on-surface mb-6 md:mb-8 leading-tight tracking-tighter font-black">
                        BEAT & VIBE: <span className="text-primary neon-glow-primary">PRODUCCIÓN</span> PARA EVENTOS DE ALTO IMPACTO
                    </h1>

                    <p className="font-body-md text-lg md:text-xl text-on-surface-variant mb-10 md:mb-12 max-w-2xl">
                        Llevamos tu evento al siguiente nivel con audio premium, iluminación inteligente y cabinas de DJ exclusivas en CDMX y área metropolitana.
                    </p>

                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-6">
                        {/* AQUÍ ESTÁ LA MAGIA: Cambiamos <button> por <a> y agregamos el href */}
                        <a
                            href="#servicios"
                            className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 md:px-10 py-4 md:py-5 rounded-lg font-label-md text-label-md uppercase tracking-widest neon-glow-primary hover:scale-105 transition-transform w-full sm:w-auto text-center"
                        >
                            Cotizar Ahora
                        </a>

                        <a href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="border border-secondary text-secondary px-8 md:px-10 py-4 md:py-5 rounded-lg font-label-md text-label-md uppercase tracking-widest hover:bg-secondary/10 transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
                            <span className="material-symbols-outlined text-base">chat</span> WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
}
