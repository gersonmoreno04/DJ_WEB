// Recibimos las variables que nos mandó Home.jsx
export default function Servicios({ paquete, setPaquete }) {

    // Función para seleccionar el paquete y bajar a la calculadora
    const elegirPaquete = (tipo) => {
        setPaquete(tipo);
        window.location.href = "#cotizar";
    };

    return (
        <section id="servicios" className="py-24 bg-surface-container-low">
            <div className="max-w-7xl mx-auto px-4 md:px-16">
                <div className="text-center mb-20">
                    <span className="text-sm font-bold text-secondary uppercase tracking-[0.3em]">CDMX Exclusive</span>
                    <h2 className="font-headline-lg text-4xl md:text-5xl font-black mt-4">SERVICIO DJ PROFESIONAL</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Plan Básico */}
                    <div className={`glass-card p-10 flex flex-col rounded-xl transition-all duration-300 border-t-4 ${paquete === 'basico' ? 'border-t-secondary neon-glow-secondary scale-105' : 'border-t-on-surface-variant'}`}>
                        <div className="mb-8">
                            <h3 className="font-headline-md text-2xl font-bold mb-2">Paquete Básico</h3>
                            <div className="text-on-surface text-4xl font-black">$5,500 <span className="text-lg font-normal">/ 5 HORAS</span></div>
                        </div>
                        <ul className="space-y-4 mb-10 flex-grow">
                            <li className="flex items-center gap-3 text-base"><span className="material-symbols-outlined text-primary">check_circle</span> DJ Profesional (Multigénero)</li>
                            <li className="flex items-center gap-3 text-base"><span className="material-symbols-outlined text-primary">check_circle</span> Sistema de Audio High-Fidelity</li>
                            <li className="flex items-center gap-3 text-base"><span className="material-symbols-outlined text-primary">check_circle</span> Iluminación Ambiental LED</li>
                            <li className="flex items-center gap-3 text-base text-on-surface-variant/50 line-through"><span className="material-symbols-outlined">block</span> Efectos CO2 & Lasers</li>
                        </ul>
                        <button
                            onClick={() => elegirPaquete('basico')}
                            className={`w-full py-4 font-bold uppercase tracking-widest rounded-lg transition-all ${paquete === 'basico' ? 'bg-secondary text-on-secondary' : 'border border-outline text-on-surface hover:bg-white/5'}`}
                        >
                            {paquete === 'basico' ? 'Seleccionado' : 'Seleccionar Básico'}
                        </button>
                    </div>

                    {/* Plan Premium */}
                    <div className={`glass-card p-10 flex flex-col relative rounded-xl transition-all duration-300 border-t-4 ${paquete === 'premium' ? 'border-t-primary neon-glow-primary scale-105' : 'border-t-on-surface-variant'}`}>
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-sm font-bold">MÁS POPULAR</div>
                        <div className="mb-8">
                            <h3 className="font-headline-md text-2xl font-bold mb-2">Paquete Premium</h3>
                            <div className="text-on-surface text-4xl font-black">$7,500 <span className="text-lg font-normal">/ 5 HORAS</span></div>
                        </div>
                        <ul className="space-y-4 mb-10 flex-grow">
                            <li className="flex items-center gap-3 text-base font-bold text-primary"><span className="material-symbols-outlined">verified</span> Todo lo del Básico +</li>
                            <li className="flex items-center gap-3 text-base"><span className="material-symbols-outlined text-secondary">flare</span> Efectos CO2 de Alta Presión</li>
                            <li className="flex items-center gap-3 text-base"><span className="material-symbols-outlined text-secondary">bolt</span> Show de Lasers RGB 2W</li>
                            <li className="flex items-center gap-3 text-base"><span className="material-symbols-outlined text-secondary">wb_incandescent</span> Robótica Pro (Cabezas Móviles)</li>
                        </ul>
                        <button
                            onClick={() => elegirPaquete('premium')}
                            className={`w-full py-4 font-bold uppercase tracking-widest rounded-lg transition-all ${paquete === 'premium' ? 'bg-primary text-on-primary' : 'border border-outline text-on-surface hover:bg-white/5'}`}
                        >
                            {paquete === 'premium' ? 'Seleccionado' : 'Reservar Premium'}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}