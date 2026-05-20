import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Equipo() {
    // ── Estados: catálogo + calculadora de envíos ──────────────────────────────
    const [productos, setProductos] = useState([]);
    const [loadingProductos, setLoadingProductos] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [estado, setEstado] = useState('CDMX');
    const [distancia, setDistancia] = useState('');
    const [resultadoEnvio, setResultadoEnvio] = useState(null);
    const [loadingEnvio, setLoadingEnvio] = useState(false);

    // ── Carga de productos desde el backend ────────────────────────────────────
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/productos');
                const data = await res.json();
                setProductos(Array.isArray(data) ? data : (data.productos || []));
            } catch (error) {
                console.error('Error al traer productos:', error);
            } finally {
                setLoadingProductos(false);
            }
        };
        fetchProductos();
    }, []);

    // ── Helpers ────────────────────────────────────────────────────────────────
    const formatearDinero = (num) =>
        new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(num);

    const cerrarModal = () => {
        setShowModal(false);
        setResultadoEnvio(null);
        setDistancia('');
    };

    // ── Cotización de envío ────────────────────────────────────────────────────
    const handleCotizar = async (e) => {
        e.preventDefault();
        setLoadingEnvio(true);
        try {
            const res = await fetch('http://localhost:5000/api/productos/cotizar-envio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado, distanciaKm: Number(distancia) }),
            });
            const data = await res.json();
            if (res.ok) setResultadoEnvio(data);
            else alert('Hubo un error en la validación.');
        } catch (error) {
            console.error('Error:', error);
            alert('No hay conexión con el servidor.');
        } finally {
            setLoadingEnvio(false);
        }
    };

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="selection:bg-primary selection:text-on-primary min-h-screen bg-surface text-on-surface flex flex-col relative">
            <Navbar />

            <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 md:px-16 flex-grow">

                {/* Hero */}
                <header className="mb-20 text-center md:text-left">
                    <h1 className="text-5xl md:text-7xl font-black mb-4 text-primary tracking-tighter">
                        CABINAS DJ
                    </h1>
                    <p className="text-lg text-on-surface-variant max-w-2xl">
                        Equipo de escenario de primera calidad diseñadas para aislamiento de vibraciones, claridad acústica y prestaciones de alta intensidad.
                    </p>
                </header>

                {/* Banner de envío */}
                <div className="glass-card rounded-xl p-6 mb-16 flex flex-wrap items-center justify-center md:justify-between gap-6 border-l-4 border-l-tertiary">
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-tertiary text-3xl">local_shipping</span>
                        <div>
                            <p className="text-sm font-bold text-on-surface">Envío gratis a 5km de Estadio Azteca</p>
                            <p className="text-xs text-on-surface-variant uppercase tracking-widest">Zona Metropolitana</p>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-white/10 hidden md:block" />
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-secondary text-3xl">location_city</span>
                        <p className="text-sm font-bold text-on-surface">$200 CDMX</p>
                    </div>
                    <div className="h-8 w-px bg-white/10 hidden md:block" />
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-8 py-3 bg-surface-variant text-on-surface rounded-lg text-sm font-bold hover:bg-white/10 transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">calculate</span>
                        Cotizar interior
                    </button>
                </div>

                {/* ── MODAL DE COTIZACIÓN ──────────────────────────────────────── */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="glass-card p-8 rounded-2xl w-full max-w-md relative border border-white/20 shadow-2xl">

                            {/* Cerrar */}
                            <button
                                onClick={cerrarModal}
                                className="absolute top-4 right-4 text-on-surface-variant hover:text-white"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>

                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-secondary">map</span>
                                Calculadora de Envío
                            </h3>

                            {!resultadoEnvio ? (
                                <form onSubmit={handleCotizar} className="space-y-4">
                                    <div>
                                        <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest block mb-2">
                                            Estado
                                        </label>
                                        <select
                                            value={estado}
                                            onChange={(e) => setEstado(e.target.value)}
                                            className="w-full bg-surface-container border border-white/10 rounded-lg p-3 text-on-surface outline-none focus:border-secondary"
                                        >
                                            <option value="CDMX">CDMX</option>
                                            <option value="EDOMEX">Estado de México</option>
                                            <option value="OTRO">Interior de la República</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest block mb-2">
                                            Distancia Aproximada (Km)
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={distancia}
                                            onChange={(e) => setDistancia(e.target.value)}
                                            placeholder="Ej. 12"
                                            className="w-full bg-surface-container border border-white/10 rounded-lg p-3 text-on-surface outline-none focus:border-secondary"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loadingEnvio}
                                        className="w-full mt-4 bg-secondary text-on-secondary py-3 rounded-xl font-bold active:scale-95 transition-all disabled:opacity-60"
                                    >
                                        {loadingEnvio ? 'Calculando...' : 'Cotizar'}
                                    </button>
                                </form>
                            ) : (
                                <div className="space-y-4 text-center mt-4">
                                    <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                                        <span className="material-symbols-outlined text-4xl text-secondary">local_shipping</span>
                                    </div>
                                    <p className="text-on-surface-variant text-sm">
                                        Destino: {resultadoEnvio.estadoDestino}
                                    </p>
                                    <p className="text-4xl font-black text-white my-2">
                                        {resultadoEnvio.costoEnvio === 0
                                            ? '¡GRATIS!'
                                            : resultadoEnvio.costoEnvio === null
                                                ? 'A cotizar'
                                                : `$${resultadoEnvio.costoEnvio} MXN`}
                                    </p>
                                    <p className="text-secondary font-bold mb-6">{resultadoEnvio.mensaje}</p>
                                    <button
                                        onClick={cerrarModal}
                                        className="w-full border border-white/20 text-white py-3 rounded-xl font-bold hover:bg-white/10 transition-colors"
                                    >
                                        Entendido
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {/* ── FIN MODAL ────────────────────────────────────────────────── */}

                {/* Catálogo dinámico */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loadingProductos ? (
                        <p className="text-secondary animate-pulse col-span-full">
                            Cargando catálogo desde la base de datos...
                        </p>
                    ) : productos.length === 0 ? (
                        <p className="text-on-surface-variant col-span-full">
                            No hay productos disponibles en este momento.
                        </p>
                    ) : (
                        productos.map((prod) => (
                            <div
                                key={prod._id}
                                className="glass-card p-6 rounded-xl border border-white/10 hover:border-secondary transition-all"
                            >
                                {prod.fotos?.[0] && (
                                    <img
                                        src={prod.fotos[0]}
                                        alt={prod.nombre}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                )}
                                <h3 className="text-xl font-bold">{prod.nombre}</h3>
                                <p className="text-on-surface-variant text-sm mt-2">{prod.descripcion}</p>
                                <p className="text-secondary font-bold mt-4 text-lg">
                                    {formatearDinero(prod.precio)}
                                </p>
                                {prod.linkAmazon && (
                                    <a
                                        href={prod.linkAmazon}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block mt-4 text-primary text-sm font-bold underline"
                                    >
                                        Ver en Amazon
                                    </a>
                                )}
                            </div>
                        ))
                    )}
                </div>

            </main>

            <Footer />
        </div>
    );
}