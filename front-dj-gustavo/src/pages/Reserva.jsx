import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Reserva() {
    const location = useLocation();

    // 1. ESTADO DE LA COTIZACIÓN
    const cotizacion = location.state || {
        paquete: 'basico',
        invitados: '10-100',
        horas: 5
    };
    const { paquete, invitados, horas } = cotizacion;

    // 2. ESTADOS DEL FORMULARIO Y DE CARGA
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        correo: '',
        fechaEvento: '',
        tipoEvento: 'Interior',
        direccion: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 3. FUNCIÓN PRINCIPAL DE COMPRA
    const procesarReserva = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payloadEvento = {
                nombre: formData.nombre,
                telefono: formData.telefono,
                correo: formData.correo,
                fechaEvento: formData.fechaEvento,
                tipoEvento: formData.tipoEvento,
                direccion: formData.direccion,
                numeroPersonas: invitados === 'base' ? '10-100' : invitados,
                paquete: paquete === 'premium' ? 'Premium' : 'Servicio DJ',
                cantidadHoras: horas
            };

            const resEvento = await fetch('http://localhost:5000/api/eventos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payloadEvento)
            });

            const dataEvento = await resEvento.json();

            if (!resEvento.ok) {
                throw new Error(dataEvento.mensaje || 'Error al validar los datos del evento.');
            }

            const resPago = await fetch('http://localhost:5000/api/pagos/crear-link', {
                method: 'POST'
            });

            const dataPago = await resPago.json();

            if (!resPago.ok) {
                throw new Error('Hubo un error al generar el link de pago.');
            }

            window.location.href = dataPago.linkPago;

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Cálculos de ticket
    const precioBase = paquete === 'premium' ? 7500 : 5500;
    const costoInvitados = invitados === '100-200' ? 3000 : invitados === '200-300' ? 5500 : invitados === '300+' ? 7500 : 0;
    const horasExtra = horas > 5 ? (horas - 5) : 0;
    const costoHoras = horasExtra * 1200;
    const total = precioBase + costoInvitados + costoHoras;

    const formatear = (num) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(num);

    return (
        <div className="selection:bg-primary selection:text-on-primary min-h-screen bg-background text-on-surface flex flex-col">
            <Navbar />

            <main className="pt-32 pb-24 px-4 md:px-16 max-w-7xl mx-auto flex-grow w-full">

                <header className="mb-16">
                    <h1 className="font-headline-2xl text-5xl md:text-7xl font-black text-on-surface mb-4 tracking-tighter">
                        RESERVA TU EVENTO <span className="text-primary neon-glow-primary">GDL</span>.
                    </h1>
                    <p className="text-on-surface-variant max-w-2xl font-body-lg text-lg">

                    </p>
                </header>

                <form onSubmit={procesarReserva} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-7 space-y-12">

                        {/* DATOS DEL CLIENTE */}
                        <section className="glass-card p-8 rounded-xl">
                            <h2 className="font-headline-md text-2xl font-bold mb-8 flex items-center gap-3">
                                <span className="material-symbols-outlined text-secondary">person</span>
                                Tus Datos
                            </h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="font-label-md text-sm font-bold text-on-surface-variant uppercase tracking-widest">Nombre Completo</label>
                                    <input required name="nombre" value={formData.nombre} onChange={handleChange} className="w-full bg-surface-container border border-white/10 rounded-lg p-3 focus:border-secondary outline-none text-on-surface" type="text" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="font-label-md text-sm font-bold text-on-surface-variant uppercase tracking-widest">Correo Electrónico</label>
                                        <input required name="correo" value={formData.correo} onChange={handleChange} className="w-full bg-surface-container border border-white/10 rounded-lg p-3 focus:border-secondary outline-none text-on-surface" type="email" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-label-md text-sm font-bold text-on-surface-variant uppercase tracking-widest">Teléfono (10 dígitos)</label>
                                        <input required name="telefono" value={formData.telefono} onChange={handleChange} minLength={10} className="w-full bg-surface-container border border-white/10 rounded-lg p-3 focus:border-secondary outline-none text-on-surface" type="tel" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* DETALLES DEL EVENTO */}
                        <section className="glass-card p-8 rounded-xl neon-glow-secondary">
                            <h2 className="font-headline-md text-2xl font-bold mb-8 flex items-center gap-3">
                                <span className="material-symbols-outlined text-secondary">event</span>
                                Detalles del Evento
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-2">
                                    <label className="font-label-md text-sm font-bold text-on-surface-variant uppercase tracking-widest">Fecha</label>
                                    <input required name="fechaEvento" value={formData.fechaEvento} onChange={handleChange} className="w-full bg-surface-container border border-white/10 rounded-lg p-3 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none text-on-surface" type="date" />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-label-md text-sm font-bold text-on-surface-variant uppercase tracking-widest">Tipo</label>
                                    <select name="tipoEvento" value={formData.tipoEvento} onChange={handleChange} className="w-full bg-surface-container border border-white/10 rounded-lg p-3 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none text-on-surface">
                                        <option value="Interior">Interior / Warehouse</option>
                                        <option value="Exterior">Exterior / Festival</option>
                                    </select>
                                </div>
                            </div>

                            {/* SLIDER DE HORAS (Visualmente recuperado) */}
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="font-label-md text-sm font-bold text-on-surface-variant uppercase tracking-widest">Horas de Producción</label>
                                        <span className="text-secondary font-bold font-label-md">{horas} Horas</span>
                                    </div>
                                    <input className="w-full h-2 bg-surface-variant rounded-lg appearance-none cursor-not-allowed accent-secondary opacity-50" max="24" min="5" type="range" value={horas} readOnly />
                                    <p className="text-xs text-on-surface-variant text-right">*(Definido en la pantalla anterior)*</p>
                                </div>
                            </div>
                        </section>

                        {/* UBICACIÓN CON MAPA ANIMADO */}
                        <section className="glass-card p-8 rounded-xl">
                            <h2 className="font-headline-md text-2xl font-bold mb-8 flex items-center gap-3">
                                <span className="material-symbols-outlined text-secondary">location_on</span>
                                Ubicación
                            </h2>
                            <div className="space-y-4">
                                <div className="relative">
                                    <input required name="direccion" value={formData.direccion} onChange={handleChange} className="w-full bg-surface-container border border-white/10 rounded-lg p-3 pl-12 focus:border-secondary outline-none text-on-surface" placeholder="Dirección del evento..." type="text" />
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                                </div>
                                <div className="h-48 rounded-lg overflow-hidden relative border border-white/10">
                                    <img alt="Map View" className="w-full h-full object-cover grayscale opacity-50" src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-primary/20 p-4 rounded-full border border-primary animate-pulse">
                                            <span className="material-symbols-outlined text-primary scale-150" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* TICKET / SIDEBAR (Recuperado al 100%) */}
                    <aside className="lg:col-span-5 sticky top-32">
                        <div className="glass-card p-8 rounded-xl border-primary/20 neon-glow-primary overflow-hidden relative">
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[80px]"></div>
                            <h3 className="font-headline-md text-2xl font-bold mb-8 tracking-tight">RESUMEN DE COTIZACIÓN</h3>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-lg mb-6 text-red-200 text-sm relative z-10">
                                    <span className="font-bold flex items-center gap-2">
                                        <span className="material-symbols-outlined">error</span>
                                        {error}
                                    </span>
                                </div>
                            )}

                            <div className="space-y-6 mb-8 relative z-10">
                                <div className="flex justify-between items-start pb-4 border-b border-white/5">
                                    <div>
                                        <p className="font-label-md text-sm font-bold text-on-surface">Paquete {paquete === 'premium' ? 'Premium' : 'Básico'}</p>
                                        <p className="text-xs text-on-surface-variant">Audio, iluminación & tech</p>
                                    </div>
                                    <span className="font-label-md text-sm font-bold">{formatear(precioBase)}</span>
                                </div>

                                {costoInvitados > 0 && (
                                    <div className="flex justify-between items-start pb-4 border-b border-white/5">
                                        <div>
                                            <p className="font-label-md text-sm font-bold text-on-surface">Capacidad Extra</p>
                                            <p className="text-xs text-on-surface-variant">{invitados} invitados</p>
                                        </div>
                                        <span className="font-label-md text-sm font-bold text-primary">+{formatear(costoInvitados)}</span>
                                    </div>
                                )}

                                {costoHoras > 0 && (
                                    <div className="flex justify-between items-start pb-4 border-b border-white/5">
                                        <div>
                                            <p className="font-label-md text-sm font-bold text-on-surface">Horas Extra ({horasExtra}h)</p>
                                            <p className="text-xs text-on-surface-variant">Después de las 5h base</p>
                                        </div>
                                        <span className="font-label-md text-sm font-bold">+{formatear(costoHoras)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-4">
                                    <p className="font-headline-md text-2xl font-bold">Total Final</p>
                                    <span className="font-headline-md text-3xl font-black text-secondary">{formatear(total)}</span>
                                </div>
                            </div>

                            <div className="bg-surface-variant/50 p-6 rounded-lg mb-8 space-y-4 relative z-10">
                                <div className="flex items-center gap-3 text-tertiary">
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                    <p className="font-label-md text-sm font-bold">Disponibilidad Activa</p>
                                </div>
                                <p className="text-sm text-on-surface-variant leading-relaxed">
                                    Asegura tu fecha congelando este precio con un anticipo. El resto se liquida antes del evento.
                                </p>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <button disabled={loading} type="submit" className={`w-full bg-secondary text-on-secondary py-4 rounded-full font-headline-md text-lg font-bold transition-all shadow-[0_0_30px_rgba(0,238,252,0.4)] flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}>
                                    {loading ? 'Procesando Pago...' : 'Pagar Anticipo de $1,500'}
                                    {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
                                </button>
                                <div className="flex flex-col items-center gap-3 mt-4">
                                    <p className="text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-bold">Procesado de forma segura por Mercado Pago</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </form>
            </main>

            <Footer />
        </div>
    );
}