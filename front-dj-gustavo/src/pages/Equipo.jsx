import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Equipo() {
    // 1. Estados para nuestra calculadora de envíos y productos
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [estado, setEstado] = useState('CDMX');
    const [distancia, setDistancia] = useState('');
    const [resultadoEnvio, setResultadoEnvio] = useState(null);
    const [loadingEnvio, setLoadingEnvio] = useState(false);

    // 2. Conexión con la Base de Datos al cargar la página
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/productos');
                const data = await res.json();
                // Ajustamos por si el backend manda el array directo o en .productos
                setProductos(Array.isArray(data) ? data : (data.productos || []));
            } catch (error) {
                console.error("Error al traer productos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductos();
    }, []);

    const formatearDinero = (num) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(num);

    const handleCotizar = async (e) => {
        e.preventDefault();
        setLoadingEnvio(true);
        try {
            const res = await fetch('http://localhost:5000/api/productos/cotizar-envio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado, distanciaKm: Number(distancia) })
            });
            const data = await res.json();
            if (res.ok) setResultadoEnvio(data);
            else alert('Error en la validación.');
        } catch (error) {
            alert('No hay conexión con el servidor.');
        } finally {
            setLoadingEnvio(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-on-surface">
            <Navbar />
            <main className="pt-32 pb-24 px-4 md:px-16 max-w-7xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-12">CATÁLOGO DE EQUIPOS</h1>

                {/* Grid de Productos Dinámico */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        <p className="text-secondary animate-pulse">Cargando catálogo desde la base de datos...</p>
                    ) : (
                        productos.map((prod) => (
                            <div key={prod._id} className="glass-card p-6 rounded-xl border border-white/10 hover:border-secondary transition-all">
                                {prod.fotos && prod.fotos[0] && (
                                    <img src={prod.fotos[0]} alt={prod.nombre} className="w-full h-48 object-cover rounded-lg mb-4" />
                                )}
                                <h3 className="text-xl font-bold">{prod.nombre}</h3>
                                <p className="text-on-surface-variant text-sm mt-2">{prod.descripcion}</p>
                                <p className="text-secondary font-bold mt-4 text-lg">{formatearDinero(prod.precio)}</p>
                                {prod.linkAmazon && (
                                    <a href={prod.linkAmazon} target="_blank" rel="noreferrer" className="block mt-4 text-primary text-sm font-bold underline">
                                        Ver en Amazon
                                    </a>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Sección de Envíos */}
                <section className="mt-24">
                    <button onClick={() => setShowModal(true)} className="bg-secondary text-on-secondary px-8 py-4 rounded-lg font-bold">
                        Cotizar Envío Express
                    </button>
                </section>
            </main>
            <Footer />
        </div>
    );
}